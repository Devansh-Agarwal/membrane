import { describe, test, expect } from "bun:test";
import { applyJevMemoryHook } from "../server/jev-hook";
import { validateResponse, type ChoiceAnswer, type Decide, type ChoiceQuestion } from "../server/jev";

const rules = "Never store: credentials, customer emails\nAllow training: no";
const trajectory = (...facts: string[]) => facts.map(fact => JSON.stringify({ tool: "gbrain.remember", arguments: { fact, provenance: "secret source metadata" } })).join("\n");
const answer = (choice = "keep", confidence = .99, keep = .99): ChoiceAnswer => ({ type: "choice", choice, confidence, probabilities: { keep, drop: 1-keep } });
const mock = (retention = answer()): Decide => async (_state, questions) => ({ model: "test", latencyMs: 1, usage: { input_tokens: 1, output_tokens: 1 }, answers: Object.fromEntries(Object.keys(questions).map(id => [id, id.endsWith('-retain') ? retention : { type: "choice", choice: "training_candidate", confidence: .99, probabilities: { retrieval: .005, training_candidate: .99, neither: .005 } }])) });

describe("Jev memory boundary", () => {
  test("locally rejected secrets and metadata never reach the classifier", async () => {
    let state: any;
    const decide: Decide = async (s, q) => { state = s; return mock()(s, q); };
    const result = await applyJevMemoryHook(rules, trajectory("API key sk-demo-secret.", "Release connections in finally blocks."), decide);
    expect(JSON.stringify(state)).not.toContain("sk-demo-secret");
    expect(JSON.stringify(state)).not.toContain("secret source metadata");
    expect(result.items[0].payload).toBeNull();
    expect(result.outgoing).toHaveLength(1);
    expect(result.outgoing[0].policy.training_allowed).toBe(false);
    expect(result.outgoing[0].arguments.visibility).toBe("private");
  });
  test("low confidence or low keep probability withholds without reverting to baseline", async () => {
    for (const a of [answer("keep", .75, .99), answer("keep", .99, .6), answer("drop", .99, .01)]) {
      const result = await applyJevMemoryHook(rules, trajectory("A reusable runbook."), mock(a));
      expect(result.baseline.outgoing).toHaveLength(1);
      expect(result.outgoing).toHaveLength(0);
    }
  });
  test("a mixed write is rebuilt from only retained original snippets", async () => {
    const decide: Decide = async (s, q) => { const r = await mock()(s,q); r.answers['write-1-s2-retain'] = answer('drop',.99,.01); return r; };
    const result = await applyJevMemoryHook(rules, trajectory("Keep the runbook. Maya is receiving chemotherapy."), decide);
    expect(result.outgoing[0].arguments.fact).toBe("Keep the runbook.");
    expect(result.items[0].status).toBe("edited");
  });
  test("all-local blocks do not call Jev", async () => {
    const result = await applyJevMemoryHook(rules, trajectory("API key sk-demo-secret."), async () => { throw new Error("Must not call"); });
    expect(result.outgoing).toHaveLength(0);
    expect(result.jev.model).toBeNull();
  });
  test("API failure produces no result or fallback writes", async () => {
    await expect(applyJevMemoryHook(rules, trajectory("Safe operational fact."), async () => { throw new Error("upstream unavailable"); })).rejects.toThrow("upstream unavailable");
  });
  test("bounds requests before making a paid call", async () => {
    const never: Decide = async () => { throw new Error("Must not call"); };
    await expect(applyJevMemoryHook(rules, trajectory(...Array(25).fill("A useful fact.")), never)).rejects.toThrow("24 surviving");
    await expect(applyJevMemoryHook("x".repeat(12001), trajectory("A fact."), never)).rejects.toThrow("too large");
  });
});

describe("TypeSafe response validation", () => {
  const questions: Record<string, ChoiceQuestion> = { retention: { type:"choice", instructions:"keep?", criteria: {keep:"yes",drop:"no"} } };
  const response = () => ({model:"jev-test",answers:{retention:answer()},usage:{input_tokens:2,output_tokens:1}});
  test("accepts the documented response shape", () => { expect(validateResponse(response(),questions).model).toBe("jev-test"); });
  test("rejects missing answers, unknown choices, invalid confidence and distributions", () => {
    for (const mutate of [
      (r:any)=>{delete r.answers.retention;},
      (r:any)=>{r.answers.retention.choice="invented";},
      (r:any)=>{r.answers.retention.confidence=2;},
      (r:any)=>{r.answers.retention.probabilities.keep=.1;},
      (r:any)=>{r.answers.retention.probabilities={keep:.1,drop:.9};},
      (r:any)=>{r.usage.input_tokens=-1;},
    ]) { const r=response(); mutate(r); expect(()=>validateResponse(r,questions)).toThrow(); }
  });
});
