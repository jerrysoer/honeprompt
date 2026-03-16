import { complete } from "./llm.js";
import type {
  LLMResponse,
  ModelConfig,
  Score,
  ScoreResult,
  ScoringConfig,
  ScoringDimension,
  TestCase,
} from "./types.js";

// ── LLM-as-Judge ────────────────────────────────────────────

const JUDGE_SYSTEM = `You are an expert evaluator. Score the given output on a scale of 0-100.

You MUST respond with ONLY a JSON object in this exact format:
{"score": <number 0-100>, "reasoning": "<brief explanation>"}

Do not include any other text before or after the JSON.`;

function buildJudgePrompt(
  input: string,
  output: string,
  expected: string | undefined,
  criteria: string,
): string {
  let prompt = `## Scoring Criteria
${criteria}

## Input
${input}

## Output to Score
${output}`;

  if (expected) {
    prompt += `\n\n## Expected Output (reference)
${expected}`;
  }

  return prompt;
}

async function scoreWithJudge(
  judgeModel: ModelConfig,
  testCase: TestCase,
  output: string,
  criteria: string,
  outputImageUrl?: string,
): Promise<{ score: Score; cost: number }> {
  const prompt = buildJudgePrompt(
    testCase.input,
    output || (outputImageUrl ? "[See attached image]" : ""),
    testCase.expected,
    criteria,
  );

  // If there is an output image, pass it to the judge as a vision input
  const judgeImages: string[] = [];
  if (outputImageUrl) {
    judgeImages.push(outputImageUrl);
  }
  // Also pass test case images if present (vision scoring)
  if (testCase.images?.length) {
    judgeImages.push(...testCase.images);
  }

  const response: LLMResponse = await complete(
    judgeModel,
    JUDGE_SYSTEM,
    prompt,
    judgeImages.length > 0 ? judgeImages : undefined,
  );

  // Strip markdown code fences if the LLM wraps its JSON response
  const cleaned = response.content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  const parsed = JSON.parse(cleaned) as {
    score: number;
    reasoning: string;
  };

  return {
    score: {
      value: Math.max(0, Math.min(100, parsed.score)),
      reasoning: parsed.reasoning,
      testCaseId: testCase.id,
    },
    cost: response.costUsd,
  };
}

// ── Rubric (Multi-Dimension) Scoring ────────────────────────

const RUBRIC_JUDGE_SYSTEM = `You are an expert evaluator. Score the given output on multiple dimensions.

You MUST respond with ONLY a JSON object in this exact format:
{"dimensions": {"dimension_name": <number 0-100>, ...}, "reasoning": "<brief explanation covering all dimensions>"}

Do not include any other text before or after the JSON.`;

function buildRubricJudgePrompt(
  input: string,
  output: string,
  expected: string | undefined,
  dimensions: ScoringDimension[],
): string {
  let prompt = `## Scoring Dimensions\n`;
  for (const dim of dimensions) {
    prompt += `- **${dim.name}** (weight: ${dim.weight}): ${dim.criteria}\n`;
  }
  prompt += `\n## Input\n${input}\n\n## Output to Score\n${output}`;

  if (expected) {
    prompt += `\n\n## Expected Output (reference)\n${expected}`;
  }

  return prompt;
}

async function scoreWithRubric(
  judgeModel: ModelConfig,
  testCase: TestCase,
  output: string,
  dimensions: ScoringDimension[],
  outputImageUrl?: string,
): Promise<{ score: Score; cost: number }> {
  const prompt = buildRubricJudgePrompt(
    testCase.input,
    output || (outputImageUrl ? "[See attached image]" : ""),
    testCase.expected,
    dimensions,
  );

  const judgeImages: string[] = [];
  if (outputImageUrl) judgeImages.push(outputImageUrl);
  if (testCase.images?.length) judgeImages.push(...testCase.images);

  const response: LLMResponse = await complete(
    judgeModel,
    RUBRIC_JUDGE_SYSTEM,
    prompt,
    judgeImages.length > 0 ? judgeImages : undefined,
  );

  const cleaned = response.content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  const parsed = JSON.parse(cleaned) as {
    dimensions: Record<string, number>;
    reasoning: string;
  };

  // Compute weighted composite score
  let composite = 0;
  const dimScores: Record<string, number> = {};
  for (const dim of dimensions) {
    const raw = parsed.dimensions[dim.name] ?? 0;
    const clamped = Math.max(0, Math.min(100, raw));
    dimScores[dim.name] = clamped;
    composite += clamped * dim.weight;
  }

  return {
    score: {
      value: Math.max(0, Math.min(100, Math.round(composite))),
      reasoning: parsed.reasoning,
      testCaseId: testCase.id,
      dimensions: dimScores,
    },
    cost: response.costUsd,
  };
}

// ── Programmatic Scoring ────────────────────────────────────

export type EvalFunction = (
  output: string,
  testCase: TestCase,
) => number | Promise<number>;

async function scoreWithEval(
  evalFn: EvalFunction,
  testCase: TestCase,
  output: string,
): Promise<Score> {
  const value = await evalFn(output, testCase);
  return {
    value: Math.max(0, Math.min(100, value)),
    reasoning: "Programmatic evaluation",
    testCaseId: testCase.id,
  };
}

// ── Execute prompt against target model ─────────────────────

async function executePrompt(
  targetModel: ModelConfig,
  prompt: string,
  input: string,
  images?: string[],
): Promise<{ output: string; cost: number; imageUrl?: string }> {
  const response = await complete(targetModel, prompt, input, images);
  return { output: response.content, cost: response.costUsd, imageUrl: response.imageUrl };
}

// ── Public API ──────────────────────────────────────────────

export interface ScorerOptions {
  targetModel: ModelConfig;
  judgeModel: ModelConfig;
  scoringConfig: ScoringConfig;
  parallelTestCases: number;
  evalFn?: EvalFunction;
}

export async function scorePrompt(
  prompt: string,
  testCases: TestCase[],
  options: ScorerOptions,
): Promise<{ result: ScoreResult; totalCost: number }> {
  const { targetModel, judgeModel, scoringConfig, parallelTestCases, evalFn } =
    options;

  let totalCost = 0;
  const scores: Score[] = [];

  // Process test cases in batches
  for (let i = 0; i < testCases.length; i += parallelTestCases) {
    const batch = testCases.slice(i, i + parallelTestCases);
    const batchResults = await Promise.all(
      batch.map(async (testCase) => {
        // Execute the prompt (pass images for vision test cases)
        const { output, cost: execCost, imageUrl } = await executePrompt(
          targetModel,
          prompt,
          testCase.input,
          testCase.images,
        );
        totalCost += execCost;

        // Score based on mode
        if (scoringConfig.mode === "llm-judge") {
          // Use rubric scoring if dimensions are configured
          if (scoringConfig.dimensions?.length) {
            const { score, cost } = await scoreWithRubric(
              judgeModel,
              testCase,
              output,
              scoringConfig.dimensions,
              imageUrl,
            );
            totalCost += cost;
            if (imageUrl) score.imageUrl = imageUrl;
            return score;
          }

          const { score, cost } = await scoreWithJudge(
            judgeModel,
            testCase,
            output,
            scoringConfig.criteria ?? "Score the output quality 0-100.",
            imageUrl,
          );
          totalCost += cost;
          // Attach image URL to score if present
          if (imageUrl) score.imageUrl = imageUrl;
          return score;
        }

        if (scoringConfig.mode === "programmatic") {
          if (!evalFn)
            throw new Error(
              "Programmatic scoring requires an eval function (evalPath in config)",
            );
          return scoreWithEval(evalFn, testCase, output);
        }

        // Hybrid mode
        if (!evalFn)
          throw new Error(
            "Hybrid scoring requires an eval function (evalPath in config)",
          );
        const judgeWeight = scoringConfig.judgeWeight ?? 0.5;

        const [judgeResult, programmaticScore] = await Promise.all([
          scoreWithJudge(
            judgeModel,
            testCase,
            output,
            scoringConfig.criteria ?? "Score the output quality 0-100.",
            imageUrl,
          ),
          scoreWithEval(evalFn, testCase, output),
        ]);

        totalCost += judgeResult.cost;

        const combinedValue = Math.round(
          judgeResult.score.value * judgeWeight +
            programmaticScore.value * (1 - judgeWeight),
        );

        return {
          value: combinedValue,
          reasoning: `Judge: ${judgeResult.score.reasoning} | Programmatic: ${programmaticScore.value}`,
          testCaseId: testCase.id,
        } satisfies Score;
      }),
    );

    scores.push(...batchResults);
  }

  const average = Math.round(
    scores.reduce((sum, s) => sum + s.value, 0) / scores.length,
  );

  // Get N lowest scoring cases
  const sorted = [...scores].sort((a, b) => a.value - b.value);
  const lowest = sorted.slice(0, 3);

  return {
    result: { scores, average, lowest },
    totalCost,
  };
}
