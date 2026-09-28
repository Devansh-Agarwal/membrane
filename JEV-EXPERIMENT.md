# Membrane × Jev experiment

The memory hook now has an opt-in live Jev stage. The original deterministic demo remains available. Both paths produce proposed writes; neither dispatches to GBrain or starts training.

## Try it

Provide a TypeSafe key through the `TYPESAFE_API_KEY` process environment, or place the raw key in `.local/jev-api-key` with file permissions `0600`. The `.local/` directory is ignored by Git. The server never returns the key to the browser. Default commands use `--no-env-file`, so a root `.env` file is not loaded automatically.

```sh
bun run dev
# Open http://127.0.0.1:4310/jev

# Run the same fixed synthetic experiment from the terminal:
bun run experiment:jev

# Explicit hosted-classification opt-in for your own authorized inputs:
bun --no-env-file scripts/memory-hook.ts demo/memory-rules.md demo/agent-trajectory.jsonl --jev

# Optional model alias override:
JEV_MODEL=jev-preview bun run experiment:jev

# Offline tests; no API requests:
bun test
```

The browser experiment sends only the fixed cases from `demo/jev-cases.ts`; browser request bodies cannot supply classifier input. Each run makes one API request. The CLI `--jev` mode sends your Markdown rules and all snippets surviving the local filter to TypeSafe. The prefilter is incomplete; use synthetic data or data you are authorized to send. The original conversation and memory-call metadata are not included in the classifier request.

## Integration

1. Run the existing deterministic memory hook. It removes matching credential, customer-data, debug-payload and custom-phrase content.
2. Split remaining memory text into numbered sentences, with a maximum of 24 snippets per request.
3. Send two independent Choice questions per snippet: whether policy permits retention, and whether the content is a changing fact, reusable procedure, or neither.
4. Validate the returned model, usage, answer names, choices, confidence and probability distributions.
5. Keep only snippets whose retention choice is `keep`, confidence is at least 0.85, and keep probability is at least 0.85. Otherwise drop or withhold them. Assemble output from the original surviving text; Jev does not generate replacement prose.
6. Rebuild proposed memory payloads. Training remains disabled. A `training_candidate` label is advisory and cannot authorize export or training.

Errors, timeouts and malformed responses abort the live run with no approved output. There is no silent fallback that permits the deterministic output after a Jev failure. All-local blocks avoid the API entirely. Requests use the fixed official HTTPS endpoint, refuse redirects and time out after 20 seconds.

The UI exposes `GET /api/jev-experiment` for fixtures/configuration status and `POST /api/jev-experiment` for the fixed experiment. Only one browser experiment runs at a time. The server binds to loopback and retains its same-origin request checks.

## Initial observations — September 27, 2026

These are two single runs of twelve authored synthetic cases, not a held-out accuracy benchmark. The 0.85 threshold is a conservative experiment setting, not an empirically calibrated operating point. Raw results are saved locally under `.local/` and are not committed.

| Run | Returned model | Expected retention matches | API round trip | Input / output tokens |
| --- | --- | --- | --- | --- |
| Deterministic filter | Local code | 7 / 12 | Not measured | None |
| `jev-latest` plus local filter | `jev-1.13.0` | 11 / 12 | 164 ms | 3,256 / 724 |
| `jev-preview` plus local filter | `jev-1.13.0` | 11 / 12 | 136 ms | 3,256 / 724 |

Both aliases resolved to the same reported model version, so these are not evidence of a comparison between distinct model versions. Confidence varied between the two runs.

- Locally blocked: the sample API key, customer email and raw request payload. These snippets never reached Jev.
- Jev additionally withheld all five disallowed cases missed by the local filter: personal health, employee writing preferences, written-out customer revenue, mixed coverage/health, and a policy-override attempt.
- Jev retained three of four permitted cases: the incident diagnosis, operational coverage, and a troubleshooting procedure.
- The valid runbook “Always release database clients in a finally block and cap worker concurrency” was withheld at 0.75 and 0.82 confidence. We have not lowered the threshold to fit this test.
- The advisory knowledge labels matched the expected labels on the four useful examples, including the withheld runbook. Knowledge labeling does not supersede retention policy.

The main result is a useful semantic layer beyond regex matching, with a visible overblocking cost. Next experiments should use new held-out paraphrases, contradictory rules, mixed sensitive/operational text and adversarial instructions before tuning thresholds or connecting persistence. The keyword prefilter does not establish that hosted classification is authorized for real private content. Audience and expiry labels remain metadata for a future enforcing adapter.

## Verification

Eight offline tests cover local exclusions before egress, metadata omission, low-confidence/low-probability withholding, mixed-write reconstruction, no-call behavior when all content is blocked, API failure, request limits and malformed response rejection. The live CLI completed both runs above. The browser page loaded; its live button run was not verified because automatic approval review blocked an additional paid request during the publishing step.

## Sources

The integration follows TypeSafe's [OpenAPI contract](https://api.typesafe.ai/openapi.json), [interactive API reference](https://api.typesafe.ai/docs), and [primitive overview](https://docs.typesafe.ai/introduction). Model aliases were discovered through authenticated `GET /v1/models`; classification uses `POST /v1/systemone` with Bearer authentication.
