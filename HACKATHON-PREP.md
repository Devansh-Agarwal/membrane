# Your plan for today

Prepared September 27, 2026. Goal: a polished solo demo that proves one useful capability. Recommendation: **Teachback — corrections become tested, reusable agent skills.**

**Follow-up direction:** You proposed giving QM/GBrain work orders while driving. [Call Your Agent](VOICE-AGENT-IDEA.md) develops that idea using phone audio, persistent jobs, and results available on a later call. I now favor exploring this for today's demo. Further research also found GBrain's existing `skillopt` optimizer, so Teachback would need to build a distinct correction/review experience on top of existing optimization. [GBrain's tutorial overview](https://github.com/garrytan/gbrain#tutorials).

## The event

The public page lists San Francisco, September 27, and these times. Treat them as venue-local; confirm against your invitation.

| Time | Event |
|---|---|
| 12:00 PM | Doors and lunch |
| 1:00 PM | Opening remarks |
| 1:15 PM | Building starts |
| 5:00 PM | Projects due; judging starts |
| 5:45 PM | Judging ends |
| 6:00 PM | Prizes and closing |

That gives **225 minutes of building**. The theme covers extensions to QM/GBrain, agent workflows and interfaces, multiplayer, and software factories. The page does not give a street address, judging rubric, team limit, submission format, or policy on existing code. Check your accepted invitation for arrival details and ask organizers about the remaining rules. [Official event page](https://events.ycombinator.com/gstack-qm-river-memorable-hackathon).

## Why this fits your work

I briefly reviewed your Codex project list, relevant conversations, and project documents:

| Your work | What it contributes today |
|---|---|
| [scaleYourself vision](/Users/devanshagarwal/workspace/winner/scaleYourself/docs/product-vision.md) | Agents learn from corrections; changes are evaluated, versioned, and reversible. This is the clearest source for Teachback. |
| [multiplayer_ai vision](/Users/devanshagarwal/workspace/winner/multiplayer_ai/docs/product/shared-ai-workspace-product-vision.md) | One person's successful method becomes shared team capability; traces and evaluations travel with it. |
| [SelfGrowingCompany design](/Users/devanshagarwal/workspace/winner/SelfGrowingCompany/gstack-office-hour-design-doc.md) | Meeting decisions becoming scoped work is an already-developed product direction. Use a meeting-to-task example. |

The scaleYourself README describes a React/Fastify foundation. The multiplayer_ai README describes conversations, presence, and hosted agent runs. These are possible starting assets if reuse is allowed, but I have not tested either application's current runtime. Choose the one you can already run confidently; a new infrastructure migration consumes the demo budget.

## What the hosts provide

| Host | Verified role | Useful question to ask |
|---|---|---|
| [QM](https://qm.ycombinator.com/) | YC's self-hostable agent harness for personal and shared work. | “What is the quickest supported way to add one skill and expose its evaluation history?” |
| [GBrain](https://gbrain.io/) | Shared, portable knowledge for agents and teams. | “How should a skill store scope, evidence, version, and rollback metadata?” |
| [Memorable](https://www.memorable.sh/) | Extracts reusable procedures from agent runs; recalls procedures for later tasks. | “Can we attach regression cases to a procedure and show whether a correction improves it?” |
| [River](https://docs.river.ai/) | Model training and inference, including SFT, reinforcement learning, and distillation. | “Is there a supported small training recipe that can finish before 4 PM with today's credits and capacity?” |
| [Superset](https://superset.sh/) | A workspace for operating coding agents in separate worktrees. | “Can I use it to keep UI and backend changes isolated while building this demo?” |
| [UFO](https://ufo.ai/) | Its public homepage describes a business agent operating system and offers a CLI. | “What public extension or integration surface is supported today?” |

Use **one primary sponsor integration**. GBrain is a natural skill store; Memorable is a natural procedure integration. QM is attractive if organizers provide a working instance. River is a stretch option after the core demonstration works. UFO's public homepage did not provide enough technical detail to plan a dependency confidently.

Memorable already performs workflow reuse, and GBrain already shares memory. Your added value must be concrete: **a correction produces a reviewable change, passes old cases, handles new cases, and can be reversed.** This is a product hypothesis, not a claim that correction-driven optimization is a new algorithm.

## Ranked ideas

Rankings are my judgments for your experience and a 225-minute solo build. Estimates assume a working model endpoint and one sponsor connection.

### 1. Teachback — “Correct once. Prove it learned.”

**User:** someone delegating recurring work who keeps repeating the same correction.

**Demo:** meeting notes produce an over-eager task assignment. You explain your team's rule: an owner must accept responsibility before a task is ready. The app proposes a skill change, checks existing examples, and handles unseen notes. A second, overly broad correction fails a regression and is held back.

**Build:** one screen with input/output, a correction box, a skill diff, and an evaluation grid. Store versioned skills plus evidence. Export the approved bundle.

**Fit:** scaleYourself's core learning loop, made visible. Use GBrain for storing/retrieving the approved skill; optionally Memorable for the successful procedure.

**Risk:** it looks like a prompt editor if you only show the corrected example. The decisive moments are transfer to a new example and rejection of a regression. **Solo feasibility: high with narrow scope.**

### 2. Agent Time Machine — “Fix the decision where the agent went wrong.”

**User:** a person supervising a long agent workflow.

**Demo:** an agent produces a launch plan using a stale date. Click the decision in a visual timeline, replace the date, and replay the affected plan and announcement drafts. Show their diffs and the preserved earlier research.

**Build:** a fixed three-step workflow, saved intermediate artifacts, a branch button, and downstream replay. Use local draft artifacts so “rewind” has precise meaning; external actions would need separate compensation.

**Fit:** your agent review and persistent-runtime interests. QM can execute steps; GBrain can hold the decision evidence.

**Risk:** arbitrary workflow replay is too broad. Limit the first version to a known dependency chain. **Solo feasibility: medium-high. Best visual alternative.**

### 3. Launch Room — “Three people change the plan. Every artifact stays consistent.”

**User:** a small team with different dates and commitments in different documents.

**Demo:** product says October 15, sales needs a September 30 pilot, finance sets a $10k cap. The agent proposes a staged launch and updates a brief, launch message, and budget together. Every change carries its rationale.

**Build:** three local documents, role-specific constraint inputs, one coordinated proposal, and an accept button. For a solo demonstration, label role controls as a simulation; claim multiplayer only if two real sessions synchronize.

**Fit:** your multiplayer_ai project and the existing launch-room exploration. QM offers a shared execution context; GBrain preserves the decision.

**Risk:** existing app setup or live collaborative editing absorbs the afternoon. **Solo feasibility: medium; higher if your current workspace runs immediately and reuse is allowed.**

### 4. Skill Relay — “Your best workflow becomes your teammate's next result.”

**User:** a team repeatedly teaching different agents the same procedure.

**Demo:** one agent learns a meeting-to-task procedure. Export its rule, examples, and checks; a fresh agent imports it and completes a new case. The second agent sees only the approved bundle.

**Build:** one workflow, an inspectable JSON bundle, two independent agent sessions, and a transfer test. A provider switch is optional until both credentials work.

**Fit:** the shared-capability thesis in multiplayer_ai, with GBrain and Memorable.

**Risk:** memory portability already exists. Show task competence surviving the handoff and make the boundaries of the exported bundle explicit. **Solo feasibility: high; a good Teachback stretch.**

### 5. Judgment Distillery — “Turn your edits into a small model that works your way.”

**User:** an operator who repeatedly rewrites the same kind of output.

**Demo:** a small open model handles meeting commitments incorrectly; after supervised training on approved examples, it handles a reserved set better. Show the checkpoint and measured comparison.

**Build:** one bounded classification or structured-output task, one River training recipe, a fixed held-out set, and a results UI.

**Fit:** your interest in models for non-coding work and owning learned behavior.

**Risk:** credentials, queue times, model access, and training quality are unknown. Ten examples can validate plumbing but cannot establish broad quality. **Solo feasibility: low-medium; choose only with a sponsor-provided working recipe.** [River SFT walkthrough](https://docs.river.ai/guides/sft/).

**My choice:** build Teachback. Add Skill Relay only once the first demo is reliable. Choose Agent Time Machine instead if the timeline interaction excites you more than the learning loop.

## Before leaving: 45–60 minutes

1. **Arrival, 5 minutes.** Check accepted invitation, address, travel time, and admission instructions. Save the invitation offline. Pack charger, laptop, phone/hotspot, headphones, and any display adapter you normally use.
2. **Choose the demo, 10 minutes.** Read the Teachback brief and practice its opening sentence. Pick one person and one recurring task.
3. **Access, 15 minutes.** Open your chosen model/provider account and sponsor docs. Verify one harmless sample request once access is available. Keep API keys in local environment configuration. Ask whether event credits and ready-made instances are available.
4. **Data, 10 minutes.** Review the synthetic meeting cases in this folder. Separate the teaching example from regression and held-out examples. Use these instead of spending build time exporting private work data.
5. **Fallback, 10 minutes.** Decide how the demo runs locally, how you reset it, and where a recorded successful run will live. A cached run should visibly say “recorded run.”

**Read-only local check completed:** Node v24.20.0, Bun 1.3.14, Python 3.9.6, Git, npm, GitHub CLI, Claude Code, and Codex are available. `gbrain` and `uv` were not on PATH. Authentication, dependency compatibility, provider credits, and model access are unverified.

For optional GBrain setup, its official repository documents a local keyless PGLite path and currently requires Bun 1.3.11+. Your Bun meets that minimum. The unrelated npm package named `gbrain` is not the official installation. Use the project's documented installation path when you decide to connect it. [Official GBrain repository](https://github.com/garrytan/gbrain).

## Lunch and opening remarks

Ask organizers: required sponsor usage, judging criteria, demo duration, submission URL, team size, existing-code rules, and available credits. Get these settled before picking a heavyweight integration.

Ask two participants: “What's the same correction you've given an agent three times?” Follow with “What old behavior must stay correct after it learns that?” Their answers test the idea and can supply a better example.

Your introduction: “I'm Devansh. I'm building agents that improve from corrections. Today I'm making the improvement visible: teach one rule, test what changed, and keep the skill.”

## Build schedule

| Time | Deliverable |
|---|---|
| 1:15–1:30 | Confirm rules, working endpoint, and one sponsor path. Freeze scope. |
| 1:30–2:10 | One note produces one structured draft in the UI. |
| 2:10–2:50 | Correction → proposed skill change → rerun with a new version. |
| 2:50–3:25 | Regression checks, version activation, and rollback. |
| 3:25–4:00 | Sponsor retrieval/persistence, held-out run, clean error handling. |
| 4:00–4:30 | Visual polish, reset button, demo recording. |
| 4:30–4:45 | Rehearse and prepare the required submission. |
| 4:45–5:00 | Submit with a buffer; check that links and files open. |

If the first integration is still blocked at 1:45, use local versioned storage while resolving it. Label the integration status accurately. At 3:30, freeze features and finish the demonstrable flow.

## What to show and claim

Lead with the frustrating repeated mistake. Show the correction, transfer to a fresh input, the actual test results, and the saved version. Explain which sponsor component is doing real work.

Count new-case correctness and preservation of previously correct behavior separately. Report latency and cost only if measured. Describe the initial implementation as **skill/context learning**; claim model training only if weights were updated. A dozen synthetic cases demonstrates the mechanism, not production reliability.

The public event page does not publish a rubric. My suggested priorities are: immediate clarity, one real end-to-end outcome, visible ownership of the learned asset, and a reliable demonstration.
