import { applyMemoryHook } from "../server/memory-hook";
import { applyJevMemoryHook } from "../server/jev-hook";

// Explicit --jev opt-in sends rules and locally surviving snippets to TypeSafe.
// Both modes emit preview intents and never contact GBrain.
const args = Bun.argv.slice(2);
const useJev = args.includes("--jev");
const [rulesPath, trajectoryPath] = args.filter(arg => arg !== "--jev");
if (!rulesPath || !trajectoryPath) {
  console.error("Usage: bun scripts/memory-hook.ts rules.md trajectory.jsonl [--jev]");
  process.exit(1);
}
try {
  const rules = await Bun.file(rulesPath).text();
  const trajectory = await Bun.file(trajectoryPath).text();
  const result = useJev ? await applyJevMemoryHook(rules, trajectory) : applyMemoryHook(rules, trajectory);
  console.log(JSON.stringify({ mode: "preview", writes: result.outgoing, ...("jev" in result ? { jev: result.jev } : {}) }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : "Hook failed.");
  process.exit(1);
}
