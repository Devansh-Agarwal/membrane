# Membrane: a policy layer for AI memory

Hackathon narration draft. Target roughly 2½–3 minutes, with about 45 seconds for the problem. Final timings will follow the voice recording.

Headings and production notes are not spoken.

## The memory adoption problem

It’s two a.m. Checkout is failing. Your team shares logs, customer details, and a temporary credential with an AI agent. The agent helps find the fix.

The incident is over. What did your AI remember?

Teams hesitate to adopt AI memory when they cannot control what it remembers. Company policy restricts customer data. Employees have their own preferences. And permission to debug with information is not permission to store it or train on it.

Strip away too much context, and the agent misses clues. Store everything, and sensitive details become lasting memory.

Meet Membrane: a policy layer for AI memory. Keep the authorized context for the task. Control what the agent remembers afterwards.

## Jev at the memory boundary

Membrane listens before an agent writes to memory. Company policy and employee Markdown files provide the rules.

In our design, Jev turns the trajectory into structured decisions: what kind of data is this, should it stay, and how confident is the decision?

The hook removes excluded details and prepares useful facts for G Brain. Training requires separate permission.

Let’s see it work.

## 01 / Use the full context

Checkout errors hit eighteen percent after a deploy. The agent has the full conversation, including the sensitive details. It finds a connection leak. The team rolls back. Checkout recovers.

## 02 / Rules live in Markdown

The rules fit in two Markdown files. The company excludes credentials and customer data. Maya adds one preference: never remember raw request payloads. No settings maze. Just rules the employee can read and edit.

## 03 / Filter the trajectory automatically

Now watch the trajectory. The hook intercepts context, tool calls, and results before persistence. Five sensitive spans disappear. The diagnosis, rollback, and reusable fix stay. It happens automatically.

## 04 / Keep the useful lesson

This is what survives: check the pool, inspect retries, roll back, and release connections correctly. The next incident gets the lesson without the previous customer’s details.

## 05 / Retrieval or a training pilot?

When the same procedure keeps repeating, Membrane flags a training candidate. Changing facts stay in retrieval. Repeated procedures may justify a training experiment. Only permitted examples enter the export.

## 06 / The employee stays in control

Now Maya changes one line: allow training, no. Eligible examples drop to zero. The useful incident memory stays. Permission to remember and permission to train are separate.

## Full context now. Selective memory later.

Membrane: a policy layer for AI memory. Full context now. Selective memory later.

---

Production notes: Pause after “What did your AI remember?” Hold on each visible redaction. Show the training counter reaching zero before the closing line. Keep the same palette, tabs and Ava neural voice throughout. Retain the visible prototype disclosure on the pipeline slide and demo. Local filtering runs; Jev, GBrain dispatch and training remain simulated. The script describes the intended Jev pipeline. Training candidates are suggestions for an experiment, not evidence that training outperforms retrieval. Do not regenerate the video until the script is finalized.

Jev reference: https://typesafe.ai/blog/introducing-system-one-models-and-jev
