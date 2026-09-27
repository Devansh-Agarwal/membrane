import { resolve } from "node:path";
import { applyMemoryHook, exampleRules, exampleTrajectory } from "./memory-hook";

const root = resolve(import.meta.dir, "../public");
const port = Number(process.env.PORT || 4310);
const files: Record<string, string> = { "/": "ops.html", "/ops": "ops.html", "/ops.js": "ops.js", "/ops-data.js": "ops-data.js", "/ops.css": "ops.css", "/hook": "index.html", "/app.js": "app.js", "/style.css": "style.css", "/favicon.svg": "favicon.svg" };
const json = (value: unknown, status = 200) => Response.json(value, { status, headers: { "Cache-Control": "no-store" } });

const server = Bun.serve({
  hostname: "127.0.0.1", port, maxRequestBodySize: 64000,
  async fetch(request) {
    const url = new URL(request.url);
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) return json({ error: "Local demo only." }, 403);
    const origin = request.headers.get("origin");
    if (origin && origin !== url.origin) return json({ error: "Same-origin requests only." }, 403);
    try {
      if (request.method === "GET" && url.pathname === "/api/hook-example") {
        return json({ rules: exampleRules, trajectory: exampleTrajectory });
      }
      if (request.method === "POST" && url.pathname === "/api/hook") {
        const input = await request.json();
        if (typeof input.rules !== "string" || typeof input.trajectory !== "string") throw new Error("Add Markdown rules and a JSONL trajectory.");
        return json(applyMemoryHook(input.rules, input.trajectory));
      }
      if (request.method === "GET" && files[url.pathname]) {
        return new Response(Bun.file(resolve(root, files[url.pathname])), { headers: { "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff" } });
      }
      return json({ error: "Not found." }, 404);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Unable to parse this input." }, 400);
    }
  },
});
console.log(`When & What is ready at http://${server.hostname}:${server.port}`);
