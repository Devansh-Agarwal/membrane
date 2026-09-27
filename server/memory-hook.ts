export const exampleRules = `# Maya's incident memory rules

- Never store: credentials, customer emails, customer revenue, raw request payloads
- Forget incident details after: Friday
- Allow training: no

Use the complete conversation to debug the current incident.
Remember the diagnosis and reusable fix.
Apply these rules only to persistent memory.
`;

export const exampleTrajectory = [
  { role: "user", content: "INC-284: checkout errors are at 18% after v2.14. Customer caroline@northstar.example cannot place an order. Use sk-demo-ops-7fa2 for debugging." },
  { role: "tool", name: "traces.read", content: "Database connections: 200/200. Retry path skips client.release(). Raw request payload: session_id=demo-session-84; cart_total=240." },
  { role: "assistant", content: "Diagnosis: the retry path leaks connections. Roll back v2.14, verify recovery, then add client.release() in a finally block. Error rate after rollback: 0.2%." },
  { tool: "gbrain.remember", arguments: { fact: "INC-284 diagnosis: v2.14 leaked database connections; rollback restored checkout. The affected customer is caroline@northstar.example. Raw request payload: session_id=demo-session-84; cart_total=240.", provenance: "Synthetic incident" } },
  { tool: "gbrain.remember", arguments: { fact: "Runbook: check pool utilization and retry traces; release database clients in a finally block and cap worker concurrency at 40.", provenance: "Synthetic incident" } },
  { tool: "gbrain.capture", arguments: { content: "The debug API key is sk-demo-ops-7fa2." } },
].map(event => JSON.stringify(event)).join("\n");

const secrets = /api[ _-]?key|access[ _-]?token|password|secret|sk-[a-z0-9-]+|bearer\s+[a-z0-9]|postgres:\/\/[^\s]+/i;
const customerData = /[\w.+-]+@[\w.-]+\.[a-z]{2,}|\$[\d,]+\s*ARR/i;
const debugPayload = /raw request payload|session_id=/i;
const incidentDetails = /\bINC-\d+\b/i;
const writeTool = /(?:^|[._:/-])(remember|capture|put_page|put|add_memory|save_memory|write_memory)$/i;

function parseEvents(text: string): any[] {
  try { const value = JSON.parse(text); return Array.isArray(value) ? value : value.events ?? value.messages ?? [value]; }
  catch { return text.split("\n").filter(line => line.trim()).map((line, index) => {
    try { return JSON.parse(line); } catch { throw new Error(`Trajectory line ${index + 1} is not valid JSON. Paste a JSON array or JSONL.`); }
  }); }
}

export function applyMemoryHook(rules: string, trajectory: string) {
  if (!rules.trim()) throw new Error("Add a Markdown rule file first.");
  const events = parseEvents(trajectory);
  if (!Array.isArray(events) || events.length > 100) throw new Error("Use a trajectory with at most 100 events.");
  const customTerms = [...rules.matchAll(/never store:\s*(.+)/gi)].flatMap(match => match[1].split(","))
    .map(term => term.trim().replace(/[.*_`]/g, "").toLowerCase()).filter(term => term && !["credentials", "secrets", "customer emails", "customer revenue", "raw request payloads"].includes(term));
  const keepIncidentDetails = !customTerms.includes("incident details");
  const fridayExpiry = /(?:forget|expire|until|after).*(?:friday)|(?:friday).*(?:expire|end)/i.test(rules);
  const items: any[] = [];
  let untouchedMessages = 0;

  for (const [index, event] of events.entries()) {
    if (!event || typeof event !== "object") throw new Error(`Event ${index + 1} must be a JSON object.`);
    const calls = event.tool_calls ?? (event.tool || event.name || event.function ? [event] : []);
    if (event.content) untouchedMessages++;
    if (!Array.isArray(calls)) throw new Error(`Event ${index + 1}: tool_calls must be an array.`);
    for (const call of calls) {
      const name = call.function?.name ?? call.tool ?? call.name ?? "";
      if (typeof name !== "string" || !writeTool.test(name)) continue;
      let args = call.function?.arguments ?? call.arguments ?? call.input ?? {};
      if (typeof args === "string") { try { args = JSON.parse(args); } catch { throw new Error(`Arguments for ${name} must be valid JSON.`); } }
      if (!args || typeof args !== "object" || Array.isArray(args)) throw new Error(`Arguments for ${name} must be an object.`);
      const text = [args.fact, args.content, args.text, args.body, args.memory].find(value => typeof value === "string");
      if (!text) {
        items.push({ id: `write-${items.length + 1}`, tool: name, status: "blocked", original: JSON.stringify(args), cleaned: "", reasons: ["Unsupported write shape; no text forwarded."], payload: null });
        continue;
      }
      const reasons: string[] = [];
      // Rebuild the outgoing memory payload from scrubbed content. Do not forward
      // the original argument object: metadata/provenance may contain sensitive text.
      const sentences = text.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);
      const kept = sentences.filter(sentence => {
        let reason = secrets.test(sentence) ? "Company rule: exclude secrets and credentials"
          : customerData.test(sentence) ? "Company rule: exclude customer details"
          : debugPayload.test(sentence) ? "Employee rule: exclude raw request payloads"
          : !keepIncidentDetails && incidentDetails.test(sentence) ? "Employee rule: exclude incident details"
          : customTerms.some(term => sentence.toLowerCase().includes(term)) ? "Employee rule: excluded phrase" : null;
        if (reason) reasons.push(reason);
        return !reason;
      });
      const cleaned = kept.join(" ").trim();
      const expires = fridayExpiry && incidentDetails.test(cleaned) ? "2026-10-03T00:00:00-07:00" : null;
      if (expires) reasons.push("Incident details expire after Friday; reusable runbooks can remain");
      // Synthetic employee messages have no company training grant. A personal
      // file can tighten that rule but cannot authorize training on its own.
      const payload = cleaned ? { tool: "gbrain.remember", arguments: { fact: cleaned,
        provenance: `Synthetic trajectory event ${index + 1}`, visibility: "private", ...(expires ? { ttl: expires } : {}) },
        policy: { audience: ["ops-team"], training_allowed: false } } : null;
      items.push({ id: `write-${items.length + 1}`, tool: name, status: !cleaned ? "blocked" : cleaned !== text ? "edited" : "allowed",
        original: text, cleaned, reasons: reasons.length ? [...new Set(reasons)] : ["Permitted by employee and company rules"], payload });
    }
  }
  if (!items.length) throw new Error("No recognized memory-write calls found. Try the sample gbrain.remember / gbrain.capture trajectory.");
  return { mode: "Simulated GBrain writes · deterministic rules", untouchedMessages, eventCount: events.length,
    counts: { allowed: items.filter(item => item.status === "allowed").length, edited: items.filter(item => item.status === "edited").length, blocked: items.filter(item => item.status === "blocked").length },
    items, outgoing: items.filter(item => item.payload).map(item => item.payload) };
}
