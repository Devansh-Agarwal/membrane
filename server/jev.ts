import { resolve } from "node:path";

export type ChoiceQuestion = { type: "choice"; instructions: string; criteria: Record<string, string> };
export type ChoiceAnswer = { type: "choice"; choice: string; confidence: number; probabilities: Record<string, number> };
export type JevResponse = { model: string; answers: Record<string, ChoiceAnswer>; usage: { input_tokens: number; output_tokens: number }; latencyMs: number };
export type Decide = (state: unknown, questions: Record<string, ChoiceQuestion>) => Promise<JevResponse>;
const probability = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1;

export function validateResponse(data: any, questions: Record<string, ChoiceQuestion>): Omit<JevResponse, "latencyMs"> {
  if (!data || typeof data.model !== "string" || !data.answers || !data.usage ||
      ![data.usage.input_tokens, data.usage.output_tokens].every(n => Number.isSafeInteger(n) && n >= 0)) throw new Error("Invalid Jev response metadata.");
  for (const [id, question] of Object.entries(questions)) {
    const answer = data.answers[id];
    const options = Object.keys(question.criteria);
    if (!answer || answer.type !== "choice" || !options.includes(answer.choice) || !probability(answer.confidence) ||
        !answer.probabilities || Object.keys(answer.probabilities).length !== options.length ||
        !options.every(option => probability(answer.probabilities[option])) ||
        Math.abs(options.reduce((sum, option) => sum + answer.probabilities[option], 0) - 1) > 0.02 ||
        options.some(option => answer.probabilities[option] > answer.probabilities[answer.choice] + 0.000001)) {
      throw new Error(`Invalid Jev decision for ${id}.`);
    }
  }
  return data;
}

export async function readJevKey() {
  const env = process.env.TYPESAFE_API_KEY?.trim();
  if (env) return env;
  const file = Bun.file(resolve(import.meta.dir, "../.local/jev-api-key"));
  return await file.exists() ? (await file.text()).trim() : "";
}

export const decideWithJev: Decide = async (state, questions) => {
  const key = await readJevKey();
  if (!key) throw new Error("Jev is not configured. Set TYPESAFE_API_KEY or .local/jev-api-key.");
  const start = performance.now();
  let response: Response;
  try {
    response = await fetch("https://api.typesafe.ai/v1/systemone", {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(20000),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.JEV_MODEL || "jev-latest", state, questions }),
    });
  } catch { throw new Error("Jev request failed or timed out; no memory write was approved."); }
  // Do not echo upstream bodies: they may include request content or credentials.
  if (!response.ok) throw new Error(`Jev returned HTTP ${response.status}; no memory write was approved.`);
  let data: unknown;
  try { data = await response.json(); } catch { throw new Error("Jev returned invalid JSON."); }
  return { ...validateResponse(data, questions), latencyMs: Math.round(performance.now() - start) };
};
