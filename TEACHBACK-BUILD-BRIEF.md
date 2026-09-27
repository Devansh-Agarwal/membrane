# Teachback

**Correct once. Prove it learned. Keep the skill.**

A proposed hackathon build, not an implemented application. Intended for one builder and a 225-minute window.

## Product promise

When someone corrects recurring agent work, turn the correction into a reusable skill update. Test it against known cases before activating it, show how it performs on new inputs, and keep a version that can be exported or rolled back.

This is a small, testable piece of your [scaleYourself vision](/Users/devanshagarwal/workspace/winner/scaleYourself/docs/product-vision.md). The initial demonstration uses the meeting-to-task direction from [SelfGrowingCompany](/Users/devanshagarwal/workspace/winner/SelfGrowingCompany/gstack-office-hour-design-doc.md).

## The concrete demo

A founder says: “Priya, please prepare the latency report by October 1.” Priya says: “I'll check my other priorities and get back to you.”

The agent may produce a task marked ready with Priya as its committed owner. The user teaches a company convention: **a request becomes ready only when the named owner accepts responsibility.**

The app converts this correction into a proposed rule, reruns the teaching example and saved regressions, and displays the exact skill difference. After the candidate passes the gate, activate it. On new notes, the agent recognizes both missing acceptance and genuine acceptance expressed differently.

Then submit an intentionally overbroad candidate such as “If a date is mentioned, mark the task ready.” Show which old cases it breaks and retain the earlier active version. Label this as a demonstration of the rejection path.

Measure the baseline first. If it already follows the convention, use a real additional team-specific preference or demonstrate that the gate detects no improvement. Never fabricate the initial error or a before/after score.

## One screen

| Area | Content |
|---|---|
| Left | Meeting note and current structured draft; clickable supporting quote. |
| Middle | Plain-language correction, proposed skill diff, active version. |
| Right | Teaching result, regression results, and reserved-case results shown separately. |
| Footer | Activate passing version, restore previous version, export bundle, reset demo. |

Make the transformation legible on a projector. Keep the test outcomes visible without scrolling. Show pending, failed, and completed calls distinctly. The source note, model response, and expected decision should be inspectable per case.

## Minimal data model and behavior

Store records for `SkillVersion`, `WorkExample`, `Correction`, and `EvaluationRun`. A skill version includes its parent version, workflow scope, rule text, source correction, creation time, and evaluation references. An evaluation records model identifier/settings, skill version, input ID, actual output, checks, latency, and error state.

The task output needs only:

```json
{
  "status": "ready | needs_acceptance | needs_clarification | blocked | not_action",
  "ready_to_queue": false,
  "owner": null,
  "due_date": null,
  "evidence": "An exact relevant quote from the note"
}
```

Here, `owner` means the person who accepted responsibility; a person merely proposed as owner stays unassigned. Deadlines are ISO calendar dates explicitly present in the note; missing deadlines remain null. An accepted task can be ready without a deadline. A task dependent on an unmet approval is blocked. A cancelled item is not actionable. Non-actionable items have no active owner or due date. Every output is a draft; the MVP does not create external tasks.

The model first drafts work from a note and the active skill. A correction call proposes a narrowly scoped rule change using only the teaching material. The evaluator then reruns the candidate against the frozen examples and checks structured fields. The app activates only a passing version and keeps the prior version available.

## Evaluation contract

The [case file](demo/meeting-cases.jsonl) contains one teaching example, seven regression examples, and four reserved examples. Read [the case guide](demo/README.md) before using it.

- Give the skill-update generator only the teaching note and correction. Keep expected answers out of worker prompts.
- Compare baseline and candidate using the same model and generation settings.
- Count invalid JSON, schema errors, and unhandled call failures explicitly; do not silently omit them.
- Gate activation on a passing teaching case and zero losses among previously passing regressions. Do not claim improvement if nothing improves.
- Run the reserved set after choosing the candidate. Once inspected and used for another revision, it is development data; create fresh reserved cases for another generalization claim.
- Match decision fields mechanically. Check the evidence quote exists in the source; manually verify that it supports the decision. A substring check alone cannot prove semantic support.
- Report the raw counts and the small synthetic sample size. Avoid claiming autonomy or general reliability from this experiment.

The strongest result would show a corrected mistake, preserved successes, and successful transfer. These are desired outcomes, not measured results.

## Implementation shape

Use a familiar TypeScript UI and a small server that keeps model credentials off the client. Local JSON or SQLite is sufficient for run history. The server adapter has three product operations: draft work, propose a skill update, and evaluate a version. Keep storage and model calls separable so one failed sponsor connection does not erase the demo.

**Preferred sponsor integration:** retrieve the active approved skill from GBrain when a fresh worker session starts and store an updated approved version with its evidence reference. Verify that the actual retrieval occurred. The application owns the version gate and scorecard; these are proposed application features, not assumed GBrain APIs.

**Alternative:** use Memorable's documented trace-to-procedure flow for an executed, successful workflow, with the app retaining evaluation metadata. Read its [current docs](https://www.memorable.sh/doc) when wiring the real trace. Do not submit an invented success trace merely to make an integration appear complete.

If organizers supply a working QM instance, expose the workflow as a skill there. Build a small extension rather than provisioning a whole company runtime during the afternoon. [QM repository](https://github.com/yc-software/qm).

## What to cut

Finish the input → correction → tested version → fresh input loop before adding authentication, real Slack/Linear writes, arbitrary browser automation, live meeting transcription, concurrent team editing, or general workflow discovery. Use pasted synthetic notes and one workflow.

Stretch A: export the approved rule, examples, and evaluation manifest; import it into a fresh worker session. Call this an application skill bundle, not a complete GBrain backup.

Stretch B: a second model reads the same approved bundle and reruns reserved cases. Measure transfer; do not assume it succeeds.

Stretch C: train a model on approved examples with River only after access and capacity are confirmed. Keep instruction learning and weight training separately labeled. The [River SFT guide](https://docs.river.ai/guides/sft/) provides an official starting point; its toy training result does not establish performance for this workflow.

## Proposed 90-second demo

**0–12 seconds:** “We keep correcting our agents, but we rarely see whether those corrections made them better. Teachback turns a correction into a skill with evidence.”

**12–30 seconds:** Show the meeting note, the actual baseline output, and the correction. Highlight the owner-acceptance rule.

**30–50 seconds:** Show the candidate skill diff and completed evaluation results. Inspect one preserved positive case.

**50–65 seconds:** Run or replay a clearly labeled recorded run on a new note. Show the answer and its supporting quote.

**65–80 seconds:** Show an overbroad candidate failing an old case. The active version remains intact.

**80–90 seconds:** “The rule, examples, and results belong to this workspace. A fresh agent can use the same skill.” Export the bundle or show the verified sponsor retrieval.

Confirm the actual demo duration at the event. Rehearse a 30-second and a two-minute version as well.

## Likely judge questions

**“Is it just changing a prompt?”** The initial learning mechanism is a versioned skill/context update. The product contribution is a visible correction-to-evaluation loop, preservation checks, and reusable evidence. Weight training is an optional separate implementation.

**“How do you know it generalized?”** Show results on the reserved examples, the expected decisions, and the limits of a small synthetic set. Offer a fresh note supplied by the judge if the live path is reliable.

**“Why would people use it?”** Interview users who repeatedly review the same kind of work. The hypothesis is fewer repeated corrections and less review time while preserving quality. The hackathon demonstrates the mechanism; it does not prove those business outcomes.

**“What belongs to the user?”** The approved skill, source correction, examples, version history, and evaluation records. Show the exported files and identify any provider dependency.
