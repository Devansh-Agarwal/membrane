# River AI: capabilities, limits, and demo opportunities

Researched September 27, 2026 against River's public documentation. This is a documentation assessment, not a runtime benchmark. No credentials, training jobs, deployments, or account entitlements were tested. Recommendations below are design judgments.

## What River already supplies

River supplies training and inference, with supervised fine-tuning, reinforcement learning, and distillation. The developer controls the learning loop and task design. Therefore, “add learning to River” is an inaccurate framing; the useful addition is a workflow that produces trustworthy training examples from real work and returns evaluated models to that work. [Overview](https://docs.river.ai/)

Its RL tooling already supports multi-turn tool environments. Tools execute in the developer's Python process, so they can call a simulator or other services. Stateful rollouts need separate environment instances; sequential tools need ordered dispatch. This is an integration seam, not an absent capability. [Tools and environments](https://docs.river.ai/guides/rl-tools/)

River also has recovery and evaluation machinery. The developer must preserve the local run directory and version experiment choices such as the reward function; model weights alone do not capture the whole experiment. [Evaluation and recovery](https://docs.river.ai/guides/rl-checkpoints/)

## Weaknesses and incompleteness relative to this demo

| Finding | Evidence status | Why it matters | What we add |
|---|---|---|---|
| The application must decide what constitutes good work and useful supervision. | Documented division of responsibility; product opportunity inferred. | A successful tool call is not necessarily a successful task. A transcript is not automatically a clean training example. | An experience ledger linking a task, retrieved evidence, proposed action, human correction, and observed outcome. |
| Dedicated deployment access differs from ordinary API access. | Explicit limitation. | A key that can train may still be unable to create the endpoint QM would use. | Validate access early; support checkpoint sampling through a small worker. |
| Model availability is account-specific. | Explicit limitation. | A hard-coded demo model can fail even when it appears in the public catalog. | Select from `get_capabilities()` and verify a complete sample/save/reload cycle. |
| Training progress does not establish capability improvement. | Explicit evaluation warning. | A falling loss chart can conceal memorization or regressions. | Fixed held-out cases, a prompt-only baseline, and per-behavior tests. |
| Token-level distillation is not an arbitrary teacher-model connector. | Explicit technical constraint. | A provider's plain text output cannot substitute for aligned token probabilities. | Begin with reviewed teacher-generated examples and SFT. |
| An exported adapter still needs its base model. | Explicit artifact boundary. | “Download your brain” cannot truthfully mean a standalone agent or universal model. | A manifest naming the base model, adapter, skill, tools, data provenance, and evaluation results. |

Sources for these rows: [overview](https://docs.river.ai/), [deployment access](https://docs.river.ai/guides/deployments/), [model access](https://docs.river.ai/guides/models/), [SFT evaluation](https://docs.river.ai/guides/sft/), [distillation constraints](https://docs.river.ai/guides/distillation-basics/), [adapter configuration](https://docs.river.ai/guides/lora/).

## Concrete integration constraints

Dedicated serving exposes an OpenAI-compatible endpoint, but requires a team API key with deployment access. A running deployment does not automatically pick up replacement weights at the same checkpoint path. Use a new deployment for a new checkpoint, or explicitly drain and restart. Stateless Responses requests are supported, while stored responses and background processing are not. Therefore, keep durable task state in QM or our coordinator. [Deploy and serve](https://docs.river.ai/guides/deployments/)

Training and queued sampling return asynchronous request IDs; the high-level SDK waits for results. A background Python worker can sample a saved checkpoint and return structured output to QM without presenting itself as a low-latency production endpoint. Measure latency before using that path for live voice. [Sessions and requests](https://docs.river.ai/guides/requests/)

The official SFT walkthrough uses a deliberately tiny transformation task. It verifies the plumbing, not the feasibility or duration of learning arbitrary business judgment. Budget and training duration for our task remain unknown. [First SFT run](https://docs.river.ai/guides/sft/)

For external-teacher distillation, token IDs and tokenization must align for token-probability objectives; vocabulary size alone is insufficient. River explicitly suggests teacher text plus SFT when tokenizations differ. Measure the teacher's task performance before assuming size implies quality. [Distill a larger model](https://docs.river.ai/guides/distillation-basics/)

The Console supports downloading inference checkpoints as PEFT LoRA adapters. A `river://` checkpoint identifier is not a public download link. Local inference with an exported adapter is a separate verification task requiring a compatible base model and suitable hardware. [Throughput and Console](https://docs.river.ai/guides/operations/)

## Recommended role in the combined demo

**Train one narrow decision skill.** For example, classify a proposed customer commitment as `draft`, `clarify`, or `escalate`, with structured reason codes and evidence references. QM still runs the full workflow and prepares the user-facing artifact. GBrain supplies current facts and approved reusable procedures.

Do not encode changing customer facts, deadlines, or permissions in the weights. Provide current facts at inference time, enforce permissions in ordinary application code, and train only a stable behavior whose quality we can evaluate.

Start with reviewed examples and SFT. Add RL only if a reliable, resettable simulator and objective scorer already work. A richer self-distillation recipe is a later experiment, not a dependency for a short demo.

Compare these conditions on the same held-out cases:

1. Base model with task schema and current facts.
2. Base model with the same inputs plus the best explicit procedure.
3. Trained model with the same explicit procedure: did training add value?
4. Trained model with the task schema and facts but without the procedure: did the behavior transfer into weights?

Use separate development cases to choose the checkpoint. Freeze the final holdout; do not improve the model repeatedly against it. Show errors as well as wins. Do not claim cheaper or faster inference without measuring the complete path.

## Stage-safe build sequence

1. Verify account capabilities, a baseline sample, and checkpoint reload.
2. Train and evaluate before the live presentation. Preserve the checkpoint and provenance.
3. On stage, run fresh tasks against the baseline and the evaluated checkpoint; optionally start a new training job and show its honest pending state.
4. If training yields no improvement, present the memory/skill result and the unsuccessful experiment accurately. Do not label prompt changes as weight learning.

Unanswered questions: available event credits, actual model access, deployment entitlement, queue latency, effective training cost, and held-out improvement on our task. These require a working account and measured runs.
