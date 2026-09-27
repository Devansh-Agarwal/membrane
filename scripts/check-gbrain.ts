import assert from "node:assert/strict";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const entity = `demo/setup-check-${crypto.randomUUID()}`;
const created = new Set<string>();

function gbrain(...args: string[]) {
  const run = Bun.spawnSync([`${root}/scripts/gbrain`, ...args, "--json"], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  if (run.exitCode !== 0) {
    throw new Error(`GBrain ${args[0]} failed: ${run.stderr.toString()}`);
  }
  const result = JSON.parse(run.stdout.toString());
  assert(!result.error && result.status !== "error", JSON.stringify(result));
  return result;
}

function remember(fact: string) {
  const result = gbrain("remember", fact, "--entity", entity,
    "--provenance", "Synthetic When & What setup check",
    "--visibility", "private", "--kind", "preference");
  assert.equal(result.state, "committed");
  const id = String(result.id);
  created.add(id);
  return id;
}

function forget(id: string) {
  gbrain("forget", id, "--reason", "Synthetic setup check withdrawal");
  created.delete(id);
}

try {
  const original = remember("The fictional demo operator prefers three-bullet updates.");
  const first = gbrain("recall", entity);
  assert(first.facts.some((f: any) => String(f.id) === original));
  console.log("PASS: private synthetic memory survives into a new CLI process.");

  // Explicit withdrawal + replacement works without semantic embeddings.
  forget(original);
  const replacement = remember("The fictional demo operator prefers five-bullet updates.");
  const revised = gbrain("recall", entity);
  assert(!revised.facts.some((f: any) => String(f.id) === original));
  assert(revised.facts.some((f: any) => String(f.id) === replacement));
  console.log("PASS: correction replaces the active recalled preference.");

  forget(replacement);
  assert.equal(gbrain("recall", entity).facts.length, 0);
  console.log("PASS: withdrawn facts no longer appear in active recall.");
  console.log("Note: GBrain retains fact history; withdrawal is not physical erasure.");
} finally {
  for (const id of created) forget(id);
}
