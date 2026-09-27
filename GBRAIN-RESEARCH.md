# GBrain: weaknesses, extension seams, and demo opportunities

Research date: 2026-09-27. Primary sources only. The public `master` VERSION page reports **0.59.0.0**. These are web-fetched repository snapshots with varying crawl dates, not a checked-out immutable commit or a locally executed audit. I did not install, deploy, run paid evaluations, or test the integrations. Historical benchmark results below retain their original versions and dates. [VERSION](https://github.com/garrytan/gbrain/blob/master/VERSION)

Labels: **Confirmed** means explicitly documented or visible in inspected source; **Opportunity** means a proposed addition, not proof of a universally missing feature; **Unverified** means an integration or claim needs a current checkout/runtime check.

## Main conclusion

GBrain is already much more than a vector database. Building another shared-memory chatbot, graph, voice frontend, or self-improving prompt loop would substantially duplicate existing work. The strongest addition is a **visible apprenticeship loop**: an agent performs an actual task, its actions and evidence are recorded, a human corrects it, competing improvements are evaluated on unseen scenarios, and the accepted behavior transfers to another worker without transferring private source data.

That is an opportunity to connect existing capabilities into an intelligible product. It is not a claim that GBrain has no learning or evaluation machinery.

## What already exists and should be reused

- Explicit facts with source attribution, correction/withdrawal, hybrid retrieval, optional cited synthesis with knowledge gaps, typed graph traversal, background enrichment and multiple agent integrations are shipped/documented. The repository also documents contradiction checks and a daily maintenance cycle. [README](https://github.com/garrytan/gbrain/blob/master/README.md)
- Seven stable memory verbs—`recall`, `remember`, `entity`, `synthesize`, `forget`, `context_pack`, `delta`—provide a useful adapter seam. `remember` requires provenance; `context_pack` builds deterministic session-start context; writes have durable receipt states and optional request IDs for retry recovery. `forget` expires an active fact with an audit trail. Protocol conformance establishes contracts, not ranking quality. [Memory protocol](https://github.com/garrytan/gbrain/blob/master/docs/protocol/MEMORY_VERBS_v1.md)
- Proactive context already exists: automatic reflex, an explicit `volunteer_context` operation, transcript streaming through `gbrain watch`, and harness hooks. Ambient memory capture is also implemented, with explicit enablement and separate handling for shared brains. Do not pitch either as a novel feature. [Push context](https://github.com/garrytan/gbrain/blob/master/docs/guides/push-context.md), [ambient writeback](https://github.com/garrytan/gbrain/blob/master/docs/guides/ambient-writeback.md)
- SkillOpt already optimizes skill Markdown using train/selection/test splits, proposed edits, validation gates, versions, receipts, and independent held-out safeguards for bundled mutation. `skill-autobench` already proposes benchmarks grounded in real usage history. The opportunity is integrating these into the demo's task/outcome loop. [SkillOpt guide](https://github.com/garrytan/gbrain/blob/master/docs/guides/skillopt.md), [skill-autobench](https://github.com/garrytan/gbrain/blob/master/skills/skill-autobench/SKILL.md)

## Weaknesses and incompleteness that matter to a demo

| Finding | Evidence and classification | Practical implication |
|---|---|---|
| Semantic memory is not guaranteed truth | **Confirmed:** mandatory provenance is free text, not a verified source proof; similarity-based deduplication/supersession degrades without embeddings. | Add a visible evidence card linking each important claim to the actual scenario event and its timestamp. Treat evidence extraction, belief, and authorized action as separate states. [Protocol](https://github.com/garrytan/gbrain/blob/master/docs/protocol/MEMORY_VERBS_v1.md) |
| A saved remote page is not an immediately updated graph | **Confirmed:** MCP page writes skip inline graph extraction. Stdio has best-effort maintenance; HTTP does not self-sweep. | For a live graph demo, explicitly maintain or add authorized links and verify them. Otherwise the graph animation can get ahead of real state. [Memory boundaries](https://github.com/garrytan/gbrain/blob/master/docs/guides/memory-boundaries.md) |
| Portability is partial | **Confirmed:** Markdown preserves file-backed knowledge, but DB-only knowledge, withdrawal state, receipts, revisions, and operational state require a database backup. Git sync is not a complete brain transfer. | Show transfer of an evaluated skill artifact separately from memory export. A package manifest should list what was transferred, omitted, or requires reauthorization. [System of record](https://github.com/garrytan/gbrain/blob/master/docs/architecture/system-of-record.md) |
| Push metrics do not prove use | **Confirmed:** volunteered-context usage is inferred from retrieval timestamps and can produce false positives/negatives. PGLite streaming watch can also block competing processes. | For the demo, instrument direct evidence IDs used in decisions and actions; do not use volunteer statistics as proof that learning caused success. [Push context](https://github.com/garrytan/gbrain/blob/master/docs/guides/push-context.md) |
| Voice continuity is unfinished in the reference bundle | **Confirmed:** the voice recipe explicitly defers live cross-call memory and calls personas session-scoped. It already provides WebRTC personas and brain tools. | A fresh-call continuity demonstration is meaningful if implemented and tested, especially a correction made in one call that changes behavior in the next. [Voice recipe](https://github.com/garrytan/gbrain/blob/master/recipes/agent-voice.md) |
| Voice integration is operator-owned reference code | **Confirmed:** the bundle is copied into the host repository rather than loaded by the GBrain runtime; the operator implements live context construction. | Budget integration work. Reusing the recipe is not equivalent to enabling one built-in production feature. [Reference bundle](https://github.com/garrytan/gbrain/blob/master/recipes/agent-voice/README.md), [context contract](https://github.com/garrytan/gbrain/blob/master/recipes/agent-voice/code/lib/personas/context-builder.contract.md) |

The voice recipe additionally lists missing public-deployment controls, including rate limiting and session-token protection for the tool endpoint. This is a concrete reason to keep a hackathon demo local until those controls are implemented, not a claim that the core GBrain MCP service lacks authentication. [Voice deployment checklist](https://github.com/garrytan/gbrain/blob/master/recipes/agent-voice.md#production-checklist)

## SkillOpt: exact overlap and remaining seams

**Confirmed:** its mutation target is the skill's Markdown body. It does not optimize model weights, tool implementations, configuration, or routing frontmatter. Rule judges can be gamed, and the guide recommends stronger acceptance rubrics. The docs describe an epoch-level slow update as incomplete. [SkillOpt guide](https://github.com/garrytan/gbrain/blob/master/docs/guides/skillopt.md)

Source inspection substantiates the slow-update limit: the orchestrator emits an event with `meta_edit_proposed: false` and `meta_edit_accepted: false`; no meta-edit happens there. Its normal gate accepts only when the mean of per-task median scores exceeds the prior best by 0.05, with three rollouts/judgments per selection task. These are existing evaluation controls, not new features we need to invent. [Orchestrator](https://github.com/garrytan/gbrain/blob/master/src/core/skillopt/orchestrator.ts), [validation gate](https://github.com/garrytan/gbrain/blob/master/src/core/skillopt/validate-gate.ts)

**Important correction to a superficial reading:** do not say mocked writes are wholly absent. The guide calls them a follow-up, but source already contains `write-capture.ts`, an in-memory registry for virtual `put_page`, `submit_job`, and `file_upload`, and `runRollout` accepts `writeCapture: true`. [Write capture source](https://github.com/garrytan/gbrain/blob/master/src/core/skillopt/write-capture.ts), [rollout source](https://github.com/garrytan/gbrain/blob/master/src/core/skillopt/rollout.ts)

**Confirmed in inspected source / current runtime unverified:** the standard validation gate builds `RolloutOpts` without forwarding `writeCapture`, and the inspected orchestrator does not expose that option. Therefore describe the gap as completing and validating the normal action-evaluation route. Do not claim the codebase cannot represent writes. [Validation gate](https://github.com/garrytan/gbrain/blob/master/src/core/skillopt/validate-gate.ts)

**Opportunity:** a resettable synthetic workspace with stateful tools can test an entire task: was the right issue updated, was a duplicate prevented after retry, did a correction change the next decision, and was another user's private context excluded? Virtual call capture is a useful building block, but the demo needs observed end-state outcomes.

**Ownership rule for the combined system:** SkillOpt owns proposed prompt/skill changes; River can own a narrow learned decision model, if River's actual API supports that task. GBrain owns durable evidence and memory; QM owns its execution/session lifecycle. Do not silently turn all conversation text into training data or let two optimizers overwrite the same artifact.

**Unverified:** targeted searches of GBrain README, TODOs, changelog and public search did not establish an existing `brainlearn`, River, or LoRA integration. This is bounded negative evidence, not proof of absence. A separately supplied roadmap or private component may change this finding.

## QM integration: already partly connected, docs may lag

GBrain already documents a QM integration using a central HTTP brain, scoped OAuth clients, a thin CLI, and sandbox skills. Its recommended shared-source topology isolates writes by slug prefix, while **reads remain source-granular**: all prefixes in a granted source are readable. Private employees need separate sources. Ordinary search/write traffic is not capped by the documented client daily budget, which is enforced on `submit_agent`. [QM integration](https://github.com/garrytan/gbrain/blob/master/docs/integrations/qm-harness.md)

The same GBrain document labels native QM memory decoration and MCP attachment deferred. **Do not turn that into a claim that current QM lacks a memory-provider adapter.** The parallel QM audit reports newer QM provider/configuration support; the correct conclusion is that the two repositories' integration guidance requires reconciliation and a smoke test. Stored contradiction reports are also documented as local-only for remote clients. [GBrain-side integration limits](https://github.com/garrytan/gbrain/blob/master/docs/integrations/qm-harness.md)

The smoke test should establish: identity/scope mapping, one saved fact across fresh sessions, correction, withdrawal, retry with the same request ID, and a denied cross-source read. This creates evidence for the composed system rather than inferring compatibility from interface names.

## Evaluation evidence: useful, narrowly scoped

The September 6 LongMemEval report records complete evidence retrieval for **449/470 answerable questions** and **433/500 correctly judged answers** with a reader. Those are different metrics and denominators. They are evidence for a particular corpus/configuration, not a universal product success rate. [Dated LongMemEval report](https://github.com/garrytan/gbrain-evals/blob/main/docs/benchmarks/2026-09-06-longmemeval-ranker-wave.md)

The transcript-distillation study uses 24 synthetic transcripts, including 20 expected to contain durable signal. Its August 31 comparison tested `aa820c7f` against `079941d2`, shipped as v0.47.8.0: judged salient-unit recall improved from **70.2% to 88.1%**, while measured unsupported claims remained **7.0%**. Human judge calibration remains incomplete, and fixes were informed by the same corpus. These are regression findings for that tested historical pipeline—not a measured error rate for today's GBrain or a new domain. [Dated distillation report and receipts](https://github.com/garrytan/gbrain-evals/blob/main/docs/benchmarks/2026-08-16-brainbench-cat35-transcript-distill.md)

Consequently, the demo should report its own held-out outcomes. A green retrieval score does not establish a correct action, successful memory extraction, or useful learning.

## Recommended demo: Apprentice / Agent Dojo

**Premise:** teach one agent a company-specific operational judgment, then watch the next agent apply it correctly in a fresh situation.

1. A synthetic customer incident arrives with tickets, messages, and a tiny company policy corpus. The first agent makes a plausible mistake—for example, escalating every refund request instead of recognizing an explicit exception.
2. A person corrects it: “For duplicate charges under $100, prepare the refund; for service complaints, ask for evidence first.” The correction appears as a sourced memory, a proposed skill diff, and labeled training examples with distinct ownership.
3. Press **Train in the Dojo**. An accelerated replay shows agents practicing on resettable cases. SkillOpt proposes an instruction improvement; the narrow River learner attempts the routing/decision task; the same held-out cases score both.
4. Show the result honestly: success rate, forbidden/incorrect actions, abstentions, latency, and which cases regressed. Rejected candidates stay visibly rejected.
5. Transfer only the accepted reusable behavior to a second QM worker. A fresh, unseen case succeeds; the evidence drawer shows which memory, skill version, and model version produced the action. Private customer details remain unavailable to that worker.
6. Close the loop with a second voice session: it remembers the correction and can explain the action using concrete source events.

**The visual moment:** the screen has three linked views—task board, evidence timeline, and practice arena. A correction travels through those views; the final task moves to “verified complete.” The interface should distinguish memory updates, prompt edits, learned model updates, and real tool outcomes. Avoid a generic animated graph that suggests causal learning without evidence.

**Smallest new components:** scenario/reset service; common event/receipt schema; outcome evaluator; bridge for approved examples; candidate registry with version/holdout results; scope-aware memory adapter; a compact UI over those events. Reuse GBrain retrieval, provenance, receipts, and SkillOpt. Verify the existing QM memory-provider seam before writing another adapter.

**Alternative highly visual demo:** a “Memory Time Machine” where a team changes a launch decision, the old and new evidence remain inspectable, affected plans are recomputed, and another agent explains why its answer changed. This would exercise factual correction and action consistency without requiring a long model-training run.
