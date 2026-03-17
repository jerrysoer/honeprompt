import { defineCommand, runMain } from "citty";
import { initCommand } from "./init.js";
import { runCommand } from "./run.js";
import { evalCommand } from "./eval.js";
import { generateTestsCommand } from "./generate-tests.js";
import { diffCommand } from "./diff.js";
import { estimateCommand } from "./estimate.js";

const main = defineCommand({
  meta: {
    name: "honeprompt",
    version: "0.2.0",
    description: "Autonomous prompt optimizer",
  },
  subCommands: {
    init: initCommand,
    run: runCommand,
    eval: evalCommand,
    "generate-tests": generateTestsCommand,
    diff: diffCommand,
    estimate: estimateCommand,
  },
});

runMain(main);
