import { applyMemoryHook } from "../server/memory-hook";

// Pure boundary hook: emits sanitized write intents; it does not contact GBrain.
const [rulesPath, trajectoryPath] = Bun.argv.slice(2);
if (!rulesPath || !trajectoryPath) {
  console.error("Usage: bun scripts/memory-hook.ts rules.md trajectory.jsonl");
  process.exit(1);
}
try {
  const result = applyMemoryHook(await Bun.file(rulesPath).text(), await Bun.file(trajectoryPath).text());
  console.log(JSON.stringify({ mode: "preview", writes: result.outgoing }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : "Hook failed.");
  process.exit(1);
}
