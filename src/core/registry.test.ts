import { describe, it, expect } from "vitest";
import { parseReadmeContent, countTestCasesFromJson, isValidTemplateId } from "./registry.js";

// ── Factory ─────────────────────────────────────────────

/** Build a README string with optional overrides for each field. */
function makeReadme(overrides: Partial<{
  name: string;
  description: string;
  category: string;
  author: string;
  cost: string;
  tags: string;
  baseline: string;
  final: string;
  improvement: string;
  iterations: string;
}> = {}): string {
  const {
    name = "LinkedIn Hooks",
    description = "Write compelling hooks.",
    category = "creators",
    author = "HonePrompt Team",
    cost = "$1-3 (25 iterations)",
    tags = "linkedin, hooks, copywriting",
    baseline = "TBD",
    final = "TBD",
    improvement = "TBD",
    iterations = "TBD",
  } = overrides;

  return `# ${name}

${description}

**Category:** ${category}
**Author:** ${author}
**Estimated Cost:** ${cost}
**Tags:** ${tags}

## What This Template Does

Some explanation here.

## Sample Run Results

| Metric | Value |
|--------|-------|
| Baseline Score | ${baseline} |
| Final Score | ${final} |
| Improvement | ${improvement} |
| Iterations | ${iterations} |
`;
}

// ── parseReadmeContent ──────────────────────────────────

describe("parseReadmeContent", () => {
  it("extracts name from H1", () => {
    const result = parseReadmeContent(makeReadme({ name: "TikTok Hooks" }));
    expect(result.name).toBe("TikTok Hooks");
  });

  it("extracts description from first paragraph after H1", () => {
    const result = parseReadmeContent(makeReadme({ description: "Generate scroll-stopping hooks." }));
    expect(result.description).toBe("Generate scroll-stopping hooks.");
  });

  it("extracts category", () => {
    const result = parseReadmeContent(makeReadme({ category: "developers" }));
    expect(result.category).toBe("developers");
  });

  it("extracts author", () => {
    const result = parseReadmeContent(makeReadme({ author: "Jane Doe" }));
    expect(result.author).toBe("Jane Doe");
  });

  it("extracts tags as trimmed array", () => {
    const result = parseReadmeContent(makeReadme({ tags: "seo, meta-description , marketing" }));
    expect(result.tags).toEqual(["seo", "meta-description", "marketing"]);
  });

  it("extracts estimated cost", () => {
    const result = parseReadmeContent(makeReadme({ cost: "$2-5 (25 iterations)" }));
    expect(result.estimatedCost).toBe("$2-5 (25 iterations)");
  });

  it("extracts sample run results from table", () => {
    const result = parseReadmeContent(makeReadme({
      baseline: "52",
      final: "78",
      improvement: "+26",
      iterations: "18",
    }));
    expect(result.sampleResults).toEqual({
      baseline: "52",
      final: "78",
      improvement: "+26",
      iterations: "18",
    });
  });

  // ── Edge cases / Boundary tests ──

  it("returns 'Untitled' when no H1 present", () => {
    const result = parseReadmeContent("No heading here.\n\n**Category:** test");
    expect(result.name).toBe("Untitled");
  });

  it("returns empty description when no paragraph after H1", () => {
    const content = "# Name\n\n**Category:** test\n**Author:** Team";
    const result = parseReadmeContent(content);
    expect(result.description).toBe("");
  });

  it("returns 'general' when category is missing", () => {
    const result = parseReadmeContent("# Name\n\nDesc.\n\n**Author:** Team");
    expect(result.category).toBe("general");
  });

  it("returns 'Community' when author is missing", () => {
    const result = parseReadmeContent("# Name\n\nDesc.\n\n**Category:** test");
    expect(result.author).toBe("Community");
  });

  it("returns empty tags when Tags field is missing", () => {
    const result = parseReadmeContent("# Name\n\nDesc.");
    expect(result.tags).toEqual([]);
  });

  it("returns default cost when Estimated Cost is missing", () => {
    const result = parseReadmeContent("# Name\n\nDesc.");
    expect(result.estimatedCost).toBe("~$1-5");
  });

  it("returns all TBD when no results table", () => {
    const result = parseReadmeContent("# Name\n\nDesc.");
    expect(result.sampleResults).toEqual({
      baseline: "TBD",
      final: "TBD",
      improvement: "TBD",
      iterations: "TBD",
    });
  });

  it("handles description with no blank line before metadata", () => {
    // Description line immediately followed by **Category:** on next line
    const content = "# Name\nDescription here.\n**Category:** test";
    const result = parseReadmeContent(content);
    expect(result.description).toBe("Description here.");
  });

  it("skips blank lines between H1 and description", () => {
    const content = "# Name\n\n\n\nActual description.\n\n**Category:** test";
    const result = parseReadmeContent(content);
    expect(result.description).toBe("Actual description.");
  });
});

// ── countTestCasesFromJson ──────────────────────────────

describe("countTestCasesFromJson", () => {
  it("counts items in a valid JSON array", () => {
    const json = '[{"id":"a"},{"id":"b"},{"id":"c"}]';
    expect(countTestCasesFromJson(json)).toBe(3);
  });

  it("returns 0 for an empty array", () => {
    expect(countTestCasesFromJson("[]")).toBe(0);
  });

  it("returns 0 for a JSON object (not array)", () => {
    expect(countTestCasesFromJson('{"id":"a"}')).toBe(0);
  });

  it("returns 0 for invalid JSON", () => {
    expect(countTestCasesFromJson("not json")).toBe(0);
  });

  it("returns 0 for empty string", () => {
    expect(countTestCasesFromJson("")).toBe(0);
  });
});

// ── isValidTemplateId ───────────────────────────────────

describe("isValidTemplateId", () => {
  // Valid IDs
  it("accepts lowercase kebab-case IDs", () => {
    expect(isValidTemplateId("linkedin-hooks")).toBe(true);
  });

  it("accepts single-word IDs", () => {
    expect(isValidTemplateId("blank")).toBe(true);
  });

  it("accepts IDs with numbers", () => {
    expect(isValidTemplateId("gpt4-prompts")).toBe(true);
  });

  // Blocked internal dirs
  it("rejects _template", () => {
    expect(isValidTemplateId("_template")).toBe(false);
  });

  it("rejects double-dot path traversal", () => {
    expect(isValidTemplateId("..")).toBe(false);
  });

  it("rejects single-dot", () => {
    expect(isValidTemplateId(".")).toBe(false);
  });

  // Pattern violations (path traversal / injection)
  it("rejects IDs with slashes", () => {
    expect(isValidTemplateId("../etc/passwd")).toBe(false);
  });

  it("rejects IDs with uppercase letters", () => {
    expect(isValidTemplateId("LinkedIn-Hooks")).toBe(false);
  });

  it("rejects IDs with underscores", () => {
    expect(isValidTemplateId("my_template")).toBe(false);
  });

  it("rejects IDs with spaces", () => {
    expect(isValidTemplateId("my template")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidTemplateId("")).toBe(false);
  });

  it("rejects IDs with special characters", () => {
    expect(isValidTemplateId("template;rm -rf")).toBe(false);
  });
});
