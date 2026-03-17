import { defineCommand } from "citty";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { RunReport } from "../core/types.js";

export const diffCommand = defineCommand({
  meta: {
    name: "diff",
    description: "Show diff between original and optimized prompt",
  },
  args: {
    dir: {
      type: "string",
      alias: "d",
      description: "Output directory to read from",
      default: ".honeprompt",
    },
    html: {
      type: "boolean",
      description: "Generate self-contained HTML diff file",
      default: false,
    },
    output: {
      type: "string",
      alias: "o",
      description: "Write diff to file instead of stdout",
    },
  },
  async run({ args }) {
    const reportPath = join(args.dir, "report.json");
    if (!existsSync(reportPath)) {
      console.error(`No report found at ${reportPath}. Run 'honeprompt run' first.`);
      process.exit(1);
    }

    const report = JSON.parse(readFileSync(reportPath, "utf-8")) as RunReport;

    // Read the current (optimized) prompt
    const promptPath = join(args.dir, "..", "prompt.md");
    const optimizedPrompt = existsSync(promptPath)
      ? readFileSync(promptPath, "utf-8")
      : null;

    const original = report.originalPrompt;
    const optimized = optimizedPrompt;

    if (!original) {
      console.error("Original prompt not found in report. Run was created before diff support was added.");
      process.exit(1);
    }

    if (!optimized) {
      console.error("Optimized prompt file not found.");
      process.exit(1);
    }

    // Compute LCS-based diff
    const diffLines = computeDiff(original, optimized);

    if (args.html) {
      // Generate self-contained HTML
      const htmlContent = buildDiffHTML(diffLines, report);
      if (args.output) {
        writeFileSync(args.output, htmlContent, "utf-8");
        console.log(`HTML diff written to ${args.output}`);
      } else {
        const defaultPath = join(args.dir, "diff.html");
        writeFileSync(defaultPath, htmlContent, "utf-8");
        console.log(`HTML diff written to ${defaultPath}`);
      }
    } else if (args.output) {
      // Write plain text (ANSI-stripped) to file
      const plainLines: string[] = [];
      plainLines.push("--- Original prompt");
      plainLines.push("+++ Optimized prompt");
      plainLines.push("");
      for (const line of diffLines) {
        if (line.type === "add") {
          plainLines.push(`+ ${line.text}`);
        } else if (line.type === "remove") {
          plainLines.push(`- ${line.text}`);
        } else {
          plainLines.push(`  ${line.text}`);
        }
      }
      plainLines.push("");
      plainLines.push(`Score: ${report.baselineScore} → ${report.finalScore} (+${report.improvement})`);
      writeFileSync(args.output, plainLines.join("\n"), "utf-8");
      console.log(`Diff written to ${args.output}`);
    } else {
      // Output with ANSI colors to stdout
      const RED = "\x1b[31m";
      const GREEN = "\x1b[32m";
      const GRAY = "\x1b[90m";
      const RESET = "\x1b[0m";

      console.log(`\n${GRAY}--- Original prompt${RESET}`);
      console.log(`${GRAY}+++ Optimized prompt${RESET}\n`);

      for (const line of diffLines) {
        if (line.type === "add") {
          console.log(`${GREEN}+ ${line.text}${RESET}`);
        } else if (line.type === "remove") {
          console.log(`${RED}- ${line.text}${RESET}`);
        } else {
          console.log(`${GRAY}  ${line.text}${RESET}`);
        }
      }

      console.log(`\n${GRAY}Score: ${report.baselineScore} → ${report.finalScore} (+${report.improvement})${RESET}`);
    }
  },
});

// ── LCS diff computation ──────────────────────────────────

interface DiffLine {
  type: "same" | "add" | "remove";
  text: string;
}

function computeDiff(original: string, optimized: string): DiffLine[] {
  const oldLines = original.split("\n");
  const newLines = optimized.split("\n");
  const m = oldLines.length;
  const n = newLines.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const lines: DiffLine[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      lines.push({ type: "same", text: oldLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      lines.push({ type: "add", text: newLines[j - 1] });
      j--;
    } else {
      lines.push({ type: "remove", text: oldLines[i - 1] });
      i--;
    }
  }
  lines.reverse();
  return lines;
}

// ── HTML diff generation ──────────────────────────────────

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildDiffHTML(diffLines: DiffLine[], report: RunReport): string {
  const htmlLines = diffLines.map((line) => {
    const cls =
      line.type === "add"
        ? ' class="diff-add"'
        : line.type === "remove"
          ? ' class="diff-remove"'
          : "";
    const prefix =
      line.type === "add" ? "+ " : line.type === "remove" ? "- " : "  ";
    return `<div${cls}><span style="color:#9ca3af;user-select:none">${prefix}</span>${escapeHTML(line.text) || "&nbsp;"}</div>`;
  });

  const keptCount = report.history.filter((h) => h.iteration > 0 && h.kept).length;
  const revertedCount = report.history.filter((h) => h.iteration > 0 && !h.kept).length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HonePrompt Diff</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; color: #1a1a1a; background: #FEFBF6; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 24px; }
    h1 { font-family: 'Lora', serif; font-size: 28px; margin-bottom: 8px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0; }
    .stat { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
    .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    .stat-value { font-family: 'Lora', serif; font-size: 24px; margin-top: 4px; }
    .stat-value.green { color: #15803d; }
    .diff-add { background: #dcfce7; color: #15803d; }
    .diff-remove { background: #fef2f2; color: #b91c1c; text-decoration: line-through; }
    .diff pre { font-size: 13px; line-height: 1.8; padding: 16px; overflow-x: auto; background: white; border: 1px solid #e5e7eb; border-radius: 12px; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; text-align: center; }
    @media (max-width: 640px) { .stats { grid-template-columns: repeat(2, 1fr); } }
  </style>
</head>
<body>
  <div class="container">
    <h1>HonePrompt Diff</h1>
    <p style="color:#6b7280">${new Date().toLocaleDateString()}</p>

    <div class="stats">
      <div class="stat">
        <div class="stat-label">Baseline</div>
        <div class="stat-value">${report.baselineScore}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Final Score</div>
        <div class="stat-value">${report.finalScore}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Improvement</div>
        <div class="stat-value green">+${report.improvement}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Iterations</div>
        <div class="stat-value">${report.iterations} (${keptCount} kept, ${revertedCount} reverted)</div>
      </div>
    </div>

    <div class="diff">
      <pre>${htmlLines.join("\n")}</pre>
    </div>

    <div class="footer">
      Optimized with <strong>HonePrompt</strong> &mdash; github.com/jerrysoer/honeprompt
    </div>
  </div>
</body>
</html>`;
}
