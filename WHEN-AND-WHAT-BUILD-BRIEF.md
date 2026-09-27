# When & What

**Current demo direction:** [A company brain with boundaries](WHEN-AND-WHAT-DEMO.md) supersedes this document's training-first presentation. This file retains earlier technical considerations and side-quest requirements as reference.

**Know what AI may use. Know when to train.**

Prepared September 27, 2026. Target: 90 minutes to build a bounded working demo, followed by 90 minutes to produce a two-minute video. This is a proposed product and implementation brief; no application or integrations have been built by this document.

## Product and user

The first user is an AI platform lead trying to ship a support assistant under a security team's data-use rules. They need to answer two different questions:

1. **What:** Which records may this actor use, for this purpose, with this recipient, for inference or training?
2. **When:** For this task, should we improve retrieval/context, experiment with fine-tuning, combine the two, or collect more evidence?

The deliverable is a policy-filtered context or dataset, accompanied by an inspectable decision receipt. The buyer benefits from connecting a data-use rule to the exact material that actually crosses a model boundary.

Avoid promising broad legal compliance. The initial product enforces a configured policy for its protected connector. It does not establish that the policy satisfies a law, that all sensitive material was detected, or that unrelated model calls are governed.

## The demo story

An engineer says: **“Use our company brain to build a better support assistant.”**

Six synthetic sources appear. They have different classifications, owners, permissions, and useful learning signals. A visible split separates permitted query context, training-eligible examples, restricted records, and records needing review.

Two task controls make the distinction clear:

- **Answer questions about today's enterprise pricing:** recommend RAG using permitted, current sources.
- **Classify support requests consistently:** mark fine-tuning as an experiment candidate if approved labeled examples exist; show that baseline and held-out evaluation are still required.

The owner of one training-eligible note then switches off **Allow training**. The note remains usable for an already-authorized inference purpose, but disappears from the training dataset. The previously prepared export becomes stale. Attempting to submit it is blocked until rebuilt under the new policy.

That is the principal reveal: **permission changes alter the actual data payload, not just an on-screen label.**

An optional final scene shows an existing illustrative model lineage affected by a source revocation. The model becomes “requires review/retraining” or is disabled in this demo's registry. Do not claim its weights have forgotten the source.

## The six source cards

The L1–L5 names below are this fictional company's policy, not a universal industry classification. The actor has local source-view access for this demo; downstream AI permission remains a separate check.

| Source | Example label | Approved inference | Training eligibility | Why it matters |
|---|---|---|---|---|
| Published help-center article | L1 Public | Permitted | Permitted, though task relevance still matters | Shows an ordinary allowed path. |
| Synthetic support-routing examples | L2 Internal | Permitted to the configured recipient | Permitted for the routing task | Stable behavior examples; training candidate. |
| Current enterprise pricing | L3 Confidential | Permitted only to the approved enterprise recipient | Denied | Facts change; query permission does not grant training permission. |
| Maya's escalation playbook | L2 Internal | Permitted to the approved recipient | Initially permitted; Maya revokes it live | Personal restrictions can tighten company policy. |
| Acquisition negotiation notes | L4 Restricted | Denied for external recipients | Denied | Company restriction wins even if a user wants to share. |
| Deployment note containing a fake API secret | Declared L1; detected restricted | Denied | Denied | Explicit secret detection overrides a weaker declared label. |

All content is synthetic. This makes a hosted Jev demonstration possible without shipping actual company secrets. Display that fact. Synthetic data does not make the architecture locally hosted.

## Jev's role

The user means TypeSafe's Jev/System One family. It evaluates typed questions against state and returns choices/scores/probabilities. Use that interface shape for small semantic assessments, with application code composing the final policy decision. [TypeSafe introduction](https://docs.typesafe.ai/introduction)

Ask atomic questions, such as:

- Which sensitivity category best fits this passage, including `unknown`?
- Does it describe an identifiable person's private circumstances?
- Does it contain a changing business fact or a reusable behavioral example?
- Is it relevant to the selected support task?

Jev does not generate explanatory paragraphs; explanations can be templates tied to real policy rule IDs and selected categories. Unknown, conflicting, or insufficient-confidence results go to review. Do not display confidence as the probability that the entire export is safe: TypeSafe documents confidence as a statistic of the answer distribution. [Confidence](https://docs.typesafe.ai/confidence)

Jev's documented service is a hosted API, and per-customer fine-tuning is not offered. No local deployment was established by this review. Its no-training commitment and enterprise retention options do not themselves authorize a particular company to send data. Treat classification as a separate data use with a separate recipient. [Models](https://docs.typesafe.ai/models), [data handling](https://docs.typesafe.ai/legal)

**Two-stage boundary:** First apply trusted source labels, actor access, explicit restrictions, and local secret detectors. Send text to hosted Jev only when that classification use is independently permitted. Otherwise use approved local analysis or review without sending it. Unknown real-world content cannot be declared safe merely because the remote classifier has not examined it yet.

For this demo, trusted fixture metadata marks the synthetic corpus as permitted for semantic assessment except the preblocked cases. This is not a general method of discovering unknown confidential data safely.

TypeSafe explicitly documents that adversarial content can influence Jev's answers. Keep rules, thresholds, purpose, and recipient authority outside document text; a model may raise concern but cannot override a hard denial. [Known limitations](https://docs.typesafe.ai/model-jaggedness/jev-1.13)

## Decision contract

Separate these fields instead of overloading one “safe” score:

```text
resource: document ID, version, owner, source label
request: actor, task/purpose, operation, recipient ID
assessment: model/version, categories, probabilities, status
policy: policy revision, owner preference revision, matched rule IDs
decision: allow | deny | review
learning recommendation: rag | training_candidate | hybrid | insufficient_evidence
```

Operations include `classify`, `infer`, and `train`. Production expansion also needs embedding, reranking, telemetry, evaluation/judging, and export recipients. A local vector database does not make remote embeddings or RAG prompts private.

Hard company restrictions and source access checks are mandatory; owner preferences can further restrict authorized uses but cannot relax company restrictions. A requester cannot change another owner's grant. Missing purpose/recipient permission or conflicting classification yields review/deny. Always record explicit reasons.

For mixed-source records, inherit all applicable restrictions conservatively. Do not automatically downgrade a document after removing a name; a transformed record needs its own assessment and authorization. Redaction is outside the core 90-minute scope.

The exact content to be sent must be assembled server-side from current authorized source versions. Recheck policy and preference revisions immediately before dispatch; atomically move a matching prepared manifest into the dispatching state, otherwise invalidate it. Do not accept a client-supplied “allowed” flag. Changes after dispatch cannot undo an already-sent payload.

## RAG versus training: an honest recommendation

| Observed need | Recommendation |
|---|---|
| Changing facts, citations, or document-level permission changes | Prefer RAG with permission-filtered retrieval and a permitted inference recipient. |
| Stable output behavior, repeated task-specific mistakes despite a sound prompt/context baseline, reviewed labels | Consider a fine-tuning experiment using eligible examples. |
| Stable behavior plus current company facts | Consider a tuned task model with authorized RAG. |
| No suitable permitted examples, inconsistent targets, or no baseline | Collect evidence; do not recommend immediate training. |

This is an explainable heuristic, not an experimentally proven optimizer. Show which prerequisites are missing. Never infer that a fixed number of records guarantees useful training. River's walkthrough itself distinguishes a working training loop from held-out performance evidence. [River SFT](https://docs.river.ai/guides/sft/)

Training permission and training usefulness are independent. The public article can be eligible while still being the wrong material to train on for a routing task.

## Important claim correction

Do not say trained data can never be removed. Machine unlearning exists, but reliable removal of a specific source's influence is difficult and not equivalent to deleting a row. Retraining from a clean starting point can also exclude data, subject to managing prior model copies. Our prototype prevents disallowed future use, invalidates pending artifacts, and identifies affected lineage; it does not erase learned information. [NIST definition](https://csrc.nist.gov/glossary/term/machine_unlearning), [research on limitations](https://arxiv.org/abs/2412.06966)

Likewise, revoking RAG access can block future retrieval through this connector, but does not erase earlier prompts, outputs, logs, caches, or third-party copies. A retention program is a separate capability.

## One screen

**Top:** task selector and two clear actions, **Preview AI context** and **Prepare training dataset**.

**Left:** six source cards with classification, owner, and separate inference/training permissions.

**Center:** three destination lanes: **Query context**, **Training candidates**, **Held back**. A record may have different decisions per operation. Use tabs or badges if duplication would confuse people.

**Right:** selected record's reason, governing rule, assessment status, and the exact outbound payload preview. Model assessments and deterministic policy decisions have different labels.

**Bottom:** a compact receipt with source versions, policy revision, excluded counts, and export state. Owner preferences are edited in an explicitly simulated owner view, not exposed as anyone-can-edit permissions.

Use animation only when a real state change moves a record or invalidates an export. The video can zoom into the reason and payload, so large readable text matters more than a dense compliance dashboard.

## Side-quest strategy — updated from the organizer descriptions shared by the user

These are fit judgments against the supplied descriptions, not confirmation of eligibility or the full judging rubric.

| Side quest | Concrete entry | Priority |
|---|---|---|
| GBrain: new skill or memory improvement solving tedious human problems | A `prepare-ai-use` skill that uses GBrain source IDs and versions to prepare permitted query context or training examples, with owner restrictions and a saved decision receipt. Back the skill with actual enforcement code. | Primary target. Manual AI data reviews are the tedious human problem. |
| River: custom model/agent trained using River API | Train a narrow sensitivity/content-kind classifier on reviewed synthetic examples; use its actual checkpoint in the product and show a held-out comparison. | Secondary target, conditional on early access and a working recipe. Exporting a dataset or merely queueing a job does not establish this requirement. |
| QM: fork and make it do something new | Fork QM and add a protected `prepare_learning_dataset` tool/action that enforces source permissions and invalidates stale manifests. Demonstrate it running through that fork. | Alternative primary target if QM already runs. A standalone app calling unchanged QM does not demonstrate the requested fork. |
| Memorable: innovative use | Future extension: recall a previous approved data-review procedure and revalidate it against current policy. | Defer in this build; a stale approval must never become permission. |
| UFO: extension/business automation | Future extension: data-use review as a startup onboarding workflow. | Defer; no integration has been established. |
| Superset: parallel coding agents and Superset Pages | Use the actual requested development/presentation workflow if already available. | Defer; generic subagents or a static page alone do not demonstrate the described workflow. |

Recommended scope: **GBrain primary, River stretch.** Choose QM instead of GBrain as the primary entry only if a working QM development environment makes the fork path cheaper. Keep one user story throughout.

The River stretch gives the original Jev-shaped idea a sponsor-native implementation: train a model to return a bounded schema such as `sensitivity: L1|L2|L3|L4|L5|unknown` and `content_kind: changing_fact|behavior_example|other`. Use manually reviewed synthetic labels. This is a custom structured-output classifier, not Jev, not a reproduction of its architecture, and not automatically calibrated or schema-guaranteed. Validate outputs; malformed/unknown/conflicting results go to review. Company rules and owner restrictions remain deterministic enforcement.

Use the trained classifier on approved synthetic inputs only in this demo. River-hosted classification still sends data to a provider; training it does not solve deployment inside a private data boundary. Do not claim local inference without actually exporting, loading, and running the model locally.

## Sponsor roles and build scope

- **GBrain:** implement the new skill against actual GBrain retrieval/provenance and save a receipt. If only local fixtures work, show that honestly and do not claim a completed GBrain integration.
- **QM:** optionally host the tool in a real fork if the runtime already works. General shell/browser/model traffic is outside the protection of this bounded tool unless separately integrated.
- **Jev:** optional comparison or semantic-assessment implementation. If pursuing River, avoid making both classifiers mandatory in a 90-minute build.
- **River:** for its side quest, complete a real training run, load the checkpoint, and use it on fresh examples. Record model ID, training data version, and actual evaluation outcomes. Useful improvement is a result to measure, not a promise. Otherwise keep dataset export as the product feature and omit the River-trained claim.

The core acceptance target remains policy enforcement, payload filtering, owner-preference change, stale-export rejection, and decision receipts, with one real primary sponsor extension. Actual training is required only for the River side-quest claim. Broad gateway enforcement is outside this prototype.

Suggested implementation: one small familiar web app, a server-side policy function, JSON fixtures, and a persisted revision/event log. Skip login integration, uploads/OCR, complex policy authoring, vector indexing, and production deployment. Restrict the demo to its synthetic workspace.

## 90-minute build

| Minutes | Deliverable |
|---|---|
| 0–15 | Freeze fixtures and policy. Prove the primary sponsor connection. If River credentials and a recipe already work, prepare reviewed synthetic train/dev/holdout splits and start the candidate run early; otherwise cut that stretch. |
| 15–35 | Policy function, source filtering, decision receipts, and the actual GBrain skill or QM fork action. |
| 35–55 | Three-lane UI, selected-record explanation, exact payload preview. |
| 55–70 | Owner preference toggle, revisioned manifests, stale export rejection. |
| 70–80 | RAG/training recommendation and export. If a River checkpoint is ready, compare it with the base model on held-out examples and wire the validated output. |
| 80–90 | Verify essential cases, fix critical visual issues, add reset, freeze features. |

Essential verification: company deny survives personal allow; personal deny overrides company allow; inference permission does not permit training; unknown/failed assessment cannot permit a restricted export; a stale prepared manifest cannot dispatch; preblocked raw content is absent from classifier/generator/training request payloads; ordinary allowed content still works. These are behavior checks for the actual enforcement boundary, not a classifier accuracy benchmark.

## 90-minute video production

| Minutes | Work |
|---|---|
| 0–15 | Finalize a two-minute script and rehearse against the working build. |
| 15–35 | Record clean individual screen segments, with one continuous capture proving the preference-to-payload change. |
| 35–60 | Edit, crop/zoom, record voiceover, add captions. |
| 60–75 | Add opening/closing frames and accurate integration/mode labels. |
| 75–90 | Export, watch with sound and without sound, check readability, submit, preserve a backup. |

### Two-minute script

**0:00–0:12 — Hook**

“Your company wants a smarter support model. But which documents may it use—and should it train on them at all?” Show the six source cards and the request.

**0:12–0:35 — What**

“When & What evaluates the company policy, the owner's preferences, the purpose, and the destination.” Run the audit. Show pricing permitted for a specific query, restricted notes held back, and routing examples eligible for training.

**0:35–0:55 — When**

“Prices change, so use retrieval. Consistent routing is a behavior we can evaluate for fine-tuning.” Switch tasks. Show recommendations and missing evaluation prerequisites.

**0:55–1:25 — Twist**

“Maya permits her playbook for answers, but changes her mind about training.” Change the preference. Watch the example leave the dataset. Try the old prepared export: rejected as stale. Rebuild and inspect the outgoing payload.

**1:25–1:45 — Proof**

“This receipt shows what was included, what was excluded, why, and which policy approved it.” Show the exact filtered export, IDs, and versions. For the GBrain entry, show the real skill call and saved receipt. For a completed River entry, insert a short shot of the checkpoint ID, its actual decision on a fresh example, and measured evaluation; a pending job cannot stand in for a trained model.

**1:45–2:00 — Close**

“When & What. Know what AI may use. Know when to train.” Show the core workflow and short, accurate integration labels. Describe this as a policy-enforcement prototype.

## Deliberate cuts

No universal compliance score; no claim of guaranteed leak prevention; no automatic model unlearning; no live training requirement; no dependence on a new local model download; no abstract animation presented as an actual provider call. The visual payoff comes from the policy changing the actual payload and invalidating a stale decision.
