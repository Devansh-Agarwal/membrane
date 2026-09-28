import { applyJevMemoryHook } from "../server/jev-hook";
import { jevCases, jevRules, jevTrajectory } from "../demo/jev-cases";

try {
  const result = await applyJevMemoryHook(jevRules, jevTrajectory);
  const cases = jevCases.map((c, index) => {
    const item = result.items[index];
    const kept = !!item.payload;
    const decision = result.jev.decisions.find(d => d.writeId === item.id);
    return { id: c.id, expectedKeep: c.keep, baselineKeep: result.baseline.outgoing.some(p => p.arguments.fact === c.text), actualKeep: kept, correct: kept === c.keep,
      use: decision?.use.choice ?? "local-block", expectedUse: c.use ?? null,
      confidence: decision?.retention.confidence ?? null };
  });
  console.log(JSON.stringify({ syntheticSmokeTest: true, correct: cases.filter(c => c.correct).length, total: cases.length, cases, result }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : "Jev experiment failed.");
  process.exitCode = 1;
}
