/**
 * Pure functions for parsing template README metadata and
 * validating template IDs. No filesystem I/O — testable in isolation.
 */

export interface ReadmeMeta {
  name: string;
  description: string;
  category: string;
  author: string;
  tags: string[];
  estimatedCost: string;
  sampleResults: {
    baseline: string;
    final: string;
    improvement: string;
    iterations: string;
  };
}

/** Parse template metadata from README.md content string. */
export function parseReadmeContent(content: string): ReadmeMeta {
  // H1 → name
  const nameMatch = content.match(/^#\s+(.+)$/m);
  const name = nameMatch?.[1]?.trim() ?? "Untitled";

  // First paragraph after H1 → description (single line)
  const lines = content.split("\n");
  const h1Index = lines.findIndex((l) => l.startsWith("# "));
  let description = "";
  if (h1Index >= 0) {
    for (let i = h1Index + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === "") continue;
      if (line.startsWith("**")) break;
      description = line;
      break;
    }
  }

  // **Category:** → category
  const catMatch = content.match(/\*\*Category:\*\*\s*(.+)/);
  const category = catMatch?.[1]?.trim() ?? "general";

  // **Author:** → author
  const authorMatch = content.match(/\*\*Author:\*\*\s*(.+)/);
  const author = authorMatch?.[1]?.trim() ?? "Community";

  // **Tags:** → tags
  const tagsMatch = content.match(/\*\*Tags:\*\*\s*(.+)/);
  const tags = tagsMatch?.[1]?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  // **Estimated Cost:** → estimatedCost
  const costMatch = content.match(/\*\*Estimated Cost:\*\*\s*(.+)/);
  const estimatedCost = costMatch?.[1]?.trim() ?? "~$1-5";

  // Sample Run Results table
  const sampleResults = { baseline: "TBD", final: "TBD", improvement: "TBD", iterations: "TBD" };
  const tableMatch = content.match(/## Sample Run Results[\s\S]*?\|[\s\S]*?\|[\s\S]*?\|([\s\S]*?)(?:\n##|\n$|$)/);
  if (tableMatch) {
    const rows = tableMatch[1].trim().split("\n").filter((r) => r.includes("|"));
    for (const row of rows) {
      const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 2) {
        const label = cells[0].toLowerCase();
        const value = cells[1];
        if (label.includes("baseline")) sampleResults.baseline = value;
        else if (label.includes("final")) sampleResults.final = value;
        else if (label.includes("improvement")) sampleResults.improvement = value;
        else if (label.includes("iteration")) sampleResults.iterations = value;
      }
    }
  }

  return { name, description, category, author, tags, estimatedCost, sampleResults };
}

/** Count test cases from a JSON string. Returns 0 for invalid input. */
export function countTestCasesFromJson(json: string): number {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

const BLOCKED_IDS = new Set(["_template", "..", "."]);
const SAFE_ID_PATTERN = /^[a-z0-9-]+$/;

/** Validate a template ID for safety (no path traversal, no internal dirs). */
export function isValidTemplateId(id: string): boolean {
  return SAFE_ID_PATTERN.test(id) && !BLOCKED_IDS.has(id);
}
