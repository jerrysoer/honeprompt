#!/usr/bin/env tsx
/**
 * Scans templates/ directories and generates templates/registry.json
 * Run: npx tsx scripts/build-registry.ts
 */

import { readdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseReadmeContent, countTestCasesFromJson } from "../src/core/registry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATES_DIR = join(__dirname, "..", "templates");

interface RegistryEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  testCaseCount: number;
  tags: string[];
  estimatedCost: string;
  source: "official" | "community";
  sampleResults: {
    baseline: string;
    final: string;
    improvement: string;
    iterations: string;
  };
}

const SKIP_DIRS = new Set(["_template", "blank"]);

function buildRegistry(): RegistryEntry[] {
  const entries: RegistryEntry[] = [];

  if (!existsSync(TEMPLATES_DIR)) {
    console.error("templates/ directory not found");
    process.exit(1);
  }

  const dirs = readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP_DIRS.has(d.name))
    .map((d) => d.name)
    .sort();

  for (const dir of dirs) {
    const templateDir = join(TEMPLATES_DIR, dir);
    const readmePath = join(templateDir, "README.md");
    const testCasesPath = join(templateDir, "test-cases.json");

    if (!existsSync(readmePath)) {
      console.warn(`Skipping ${dir}: no README.md`);
      continue;
    }

    const content = readFileSync(readmePath, "utf-8");
    const meta = parseReadmeContent(content);

    let testCaseCount = 0;
    if (existsSync(testCasesPath)) {
      const json = readFileSync(testCasesPath, "utf-8");
      testCaseCount = countTestCasesFromJson(json);
    }

    entries.push({
      id: dir,
      name: meta.name,
      description: meta.description,
      category: meta.category,
      author: meta.author,
      testCaseCount,
      tags: meta.tags,
      estimatedCost: meta.estimatedCost,
      source: meta.author === "HonePrompt Team" ? "official" : "community",
      sampleResults: meta.sampleResults,
    });
  }

  return entries;
}

const registry = buildRegistry();
const outputPath = join(TEMPLATES_DIR, "registry.json");
writeFileSync(outputPath, JSON.stringify(registry, null, 2) + "\n", "utf-8");
console.log(`Built registry: ${registry.length} templates → ${outputPath}`);
for (const entry of registry) {
  console.log(`  ${entry.id} (${entry.category}) — ${entry.testCaseCount} test cases`);
}
