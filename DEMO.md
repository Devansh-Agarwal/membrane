# When & What — ops incident demo

Run `bun run dev`, then open **http://127.0.0.1:4310**.

## Two-minute walkthrough

1. **Run incident demo.** Checkout errors jumped to 18% after v2.14. The team shares traces, credentials and customer details while investigating a database connection leak.
2. **Show the boundary.** The original conversation stays intact. The persistent copy drops the database credential, API key, customer email, account revenue and raw request payload. Diagnosis, rollback and the reusable fix survive.
3. **Save to demo GBrain**, then open **Clean memory**. Inspect INC-284 and expand its cleaned events. Export the cleaned trajectory if useful.
4. **Open Learning signals.** Repeated connection-pool incidents suggest a training pilot; one-off incidents stay in retrieval. Export permitted synthetic examples or run the labelled training simulation.
5. **Show employee control.** Open **Rules & connections**, click **Turn employee training off**, then **Apply rules**. Training examples drop to zero; useful memory remains available.

Talk track: **“Let the agent use the full context to fix the outage. Remember the fix, not the credentials or customer payloads. Learn recurring procedures only when the rules allow it.”**

The replay, redaction, rule edits and exports work locally. Jev classification,
GBrain dispatch and model training are simulated. Storage is in-session; refreshing
resets it. All incidents and token counts are synthetic.

## Optional: show the Markdown hook

Open **http://127.0.0.1:4310/hook**.

1. Edit the Markdown rules or upload `demo/memory-rules.md`.
2. Use the loaded incident trajectory or paste JSONL / a JSON array.
3. Click **Run memory hook**: one mixed write is edited, the runbook is allowed,
   and the API-key write is blocked. Three original conversation messages stay intact.
4. Click **Keep only the reusable runbook**. This adds
   `- Never store: incident details` and reruns the hook. Only the runbook survives.
5. Expand **Inspect the outgoing payload** to show the sanitized write intents.

The hook uses sentence-level deterministic filtering. It always excludes the
sample credential, customer-data and raw-payload categories; comma-separated
`Never store:` phrases add restrictions. `incident details` matches incident IDs
such as INC-284. Friday expiry emits a fixed synthetic timestamp. Audience,
expiry and training flags are metadata for a future adapter, not enforced access
controls. Hook training stays off; canonical GBrain visibility stays private.

## Run the same hook from files

```bash
bun scripts/memory-hook.ts demo/memory-rules.md demo/agent-trajectory.jsonl
```

The command prints only permitted write intents; it does not send them to GBrain.
It recognizes `{tool, arguments}` and OpenAI-style `tool_calls`, including
`gbrain.remember`, `gbrain.capture` and `gbrain.put_page`. It is a replay hook,
not a live universal interceptor. Local GBrain is installed separately; see
`GBRAIN-SETUP.md`.
