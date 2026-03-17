import { defineCommand } from "citty";
import { mkdirSync, writeFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import consola from "consola";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// dist/cli/ → dist/ → honeprompt/ → honeprompt/templates/
const TEMPLATES_DIR = join(__dirname, "..", "..", "templates");

interface TemplateFiles {
  prompt: string;
  testCases: string;
  config: string;
  strategy: string;
}

function loadTemplate(name: string): TemplateFiles | null {
  const dir = join(TEMPLATES_DIR, name);
  if (!existsSync(dir)) return null;

  const promptPath = join(dir, "prompt.md");
  const testCasesPath = join(dir, "test-cases.json");
  const configPath = join(dir, "honeprompt.config.ts");
  const strategyPath = join(dir, "program.md");

  if (!existsSync(promptPath) || !existsSync(testCasesPath) || !existsSync(configPath)) {
    return null;
  }

  return {
    prompt: readFileSync(promptPath, "utf-8"),
    testCases: readFileSync(testCasesPath, "utf-8"),
    config: readFileSync(configPath, "utf-8"),
    strategy: existsSync(strategyPath) ? readFileSync(strategyPath, "utf-8") : "",
  };
}

function getAvailableTemplates(): string[] {
  if (!existsSync(TEMPLATES_DIR)) return [];
  return readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "_template")
    .map((d) => d.name);
}

interface RegistryEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  testCaseCount: number;
}

function loadRegistry(): RegistryEntry[] {
  const registryPath = join(TEMPLATES_DIR, "registry.json");
  if (!existsSync(registryPath)) return [];
  try {
    return JSON.parse(readFileSync(registryPath, "utf-8"));
  } catch {
    return [];
  }
}

function printTemplateList(): void {
  const registry = loadRegistry();
  const available = getAvailableTemplates();

  if (registry.length === 0 && available.length === 0) {
    consola.warn("No templates found.");
    return;
  }

  consola.info("Available templates:\n");

  // Print registry entries (richer info)
  const registryIds = new Set(registry.map((r) => r.id));
  for (const entry of registry) {
    const line = `  ${entry.id.padEnd(28)} ${entry.category.padEnd(12)} ${entry.description.slice(0, 50)}${entry.description.length > 50 ? "..." : ""}  (${entry.testCaseCount} cases)`;
    consola.log(line);
  }

  // Print any templates not in registry
  for (const name of available) {
    if (!registryIds.has(name) && name !== "blank") {
      consola.log(`  ${name.padEnd(28)} ${"".padEnd(12)} (not in registry)`);
    }
  }

  // Always list blank last
  if (available.includes("blank")) {
    consola.log(`  ${"blank".padEnd(28)} ${"general".padEnd(12)} Minimal starter template`);
  }

  consola.log("");
  consola.info("Usage: honeprompt init <template> [-d <dir>]");
}

async function interactivePicker(): Promise<string | null> {
  const registry = loadRegistry();
  const available = getAvailableTemplates();

  if (available.length === 0) {
    consola.error("No templates found.");
    return null;
  }

  // Build choices: registry entries first, then unregistered, blank last
  const registryIds = new Set(registry.map((r) => r.id));
  const choices: Array<{ label: string; value: string }> = [];

  for (const entry of registry) {
    if (available.includes(entry.id)) {
      choices.push({
        label: `${entry.name} — ${entry.description.slice(0, 60)}`,
        value: entry.id,
      });
    }
  }

  for (const name of available) {
    if (!registryIds.has(name) && name !== "blank") {
      choices.push({ label: name, value: name });
    }
  }

  // Blank always last
  if (available.includes("blank")) {
    choices.push({
      label: "Blank — Start from scratch with a minimal template",
      value: "blank",
    });
  }

  const selected = await consola.prompt("Choose a template:", {
    type: "select",
    options: choices.map((c) => ({ label: c.label, value: c.value })),
  });

  if (typeof selected === "symbol") return null; // User cancelled
  return selected as string;
}

export const initCommand = defineCommand({
  meta: {
    name: "init",
    description: "Scaffold a new prompt optimization project",
  },
  args: {
    template: {
      type: "positional",
      description: "Template to use (run --list to see all)",
      required: false,
    },
    dir: {
      type: "string",
      description: "Output directory",
      alias: "d",
    },
    list: {
      type: "boolean",
      description: "List available templates",
      default: false,
    },
  },
  async run({ args }) {
    // --list flag: print table and exit
    if (args.list) {
      printTemplateList();
      return;
    }

    // Determine template name
    let templateName = args.template as string | undefined;

    if (!templateName) {
      // Interactive picker when no args
      const picked = await interactivePicker();
      if (!picked) {
        consola.info("Cancelled.");
        return;
      }
      templateName = picked;
    }

    const template = loadTemplate(templateName);

    if (!template) {
      const available = getAvailableTemplates();
      consola.error(
        `Unknown template: ${templateName}. Available: ${available.join(", ")}`,
      );
      consola.info("Run 'honeprompt init --list' to see all templates.");
      process.exit(1);
    }

    const dir = args.dir || templateName;
    const fullPath = join(process.cwd(), dir);

    if (existsSync(fullPath)) {
      consola.error(`Directory already exists: ${dir}`);
      process.exit(1);
    }

    mkdirSync(fullPath, { recursive: true });
    mkdirSync(join(fullPath, ".honeprompt"), { recursive: true });

    writeFileSync(join(fullPath, "prompt.md"), template.prompt, "utf-8");
    writeFileSync(join(fullPath, "test-cases.json"), template.testCases, "utf-8");
    writeFileSync(join(fullPath, "honeprompt.config.ts"), template.config, "utf-8");
    if (template.strategy) {
      writeFileSync(join(fullPath, "program.md"), template.strategy, "utf-8");
    }
    writeFileSync(
      join(fullPath, ".gitignore"),
      ".honeprompt/\nnode_modules/\n",
      "utf-8",
    );

    consola.success(`Created prompt project: ${dir}/`);
    consola.info("Files created:");
    consola.info("  prompt.md          — Your prompt to optimize");
    consola.info("  test-cases.json    — Test cases for evaluation");
    consola.info("  honeprompt.config.ts — Configuration");
    if (template.strategy) {
      consola.info("  program.md         — Strategy document for the optimizer");
    }
    consola.info("");
    consola.info("Next steps:");
    consola.info(`  cd ${dir}`);
    consola.info("  # Edit prompt.md and test-cases.json");
    consola.info("  honeprompt run");
  },
});
