# Membrane: a policy layer for AI memory

Restored narration from before the punchy rewrite. The expanded problem section takes approximately 50–55 seconds. Plan for roughly three minutes overall; exact timing will follow the final voice recording. Voice: Microsoft Ava Multilingual Neural, unchanged.

Headings and production notes are not spoken.

## The memory adoption problem

Membrane is a policy layer for AI memory. Teams hesitate to adopt AI memory when they cannot control what it remembers.

During an outage, an agent needs detailed context to help the team debug. But that conversation also contains temporary credentials, customer details, and raw request payloads. Information that helps solve today’s incident should not automatically become permanent company memory.

Company classifications set one boundary. Employee preferences add another. Permission to use information for the current task does not automatically mean permission to remember it or use it for training.

Remove too much context up front, and the agent becomes less useful. Remember everything, and teams lose control over sensitive information. That uncertainty can keep agents confined to narrow pilots.

Membrane keeps the authorized context available for the task, then applies explicit rules to what the agent remembers afterwards.

## Jev at the memory boundary

Membrane puts Jev at the memory boundary.

A local listener intercepts the trajectory and checks what may reach the classifier. Company policy and employee Markdown files supply the rules.

Jev returns structured decisions with confidence. Our hook removes excluded spans and prepares clean facts and trajectories for G Brain, with a separate training permission gate.

Here is the demo.

## 01 / Use the full context

Checkout errors jump to eighteen percent after a deploy.

The team shares database traces, customer details, and a temporary debug credential.

The agent finds a connection leak. A rollback restores checkout. None of that working context is removed.

## 02 / Rules live in Markdown

Company policy excludes credentials and customer data.

Maya adds her own preference: never retain raw request payloads.

These are simple Markdown files. They control what enters lasting memory, separately from the live conversation.

## 03 / Filter the trajectory automatically

Now follow the agent's execution trace.

Before persistence, the listener applies the rules to context, tool calls, and results.

Five sensitive spans disappear. The pool saturation, diagnosis, rollback, and reusable fix remain.

There is no manual review queue or save button.

## 04 / Keep the useful lesson

The cleaned incident is available in the demo memory.

Next time, the agent can retrieve the procedure: inspect the pool, check retries, roll back, and release connections correctly.

## 05 / Retrieval or a training pilot?

Across incidents, the same procedures start repeating.

Repeated patterns suggest a training pilot. One-off incidents stay in retrieval.

Only permitted examples enter the export. These are learning signals, not proof that training beats retrieval.

## 06 / The employee stays in control

Maya can turn training permission off with one line.

Apply the change, and permitted training examples fall to zero.

The useful incident memory stays. Permission to remember is separate from permission to train.

## Full context now. Selective memory later.

The rule filtering works locally.

Membrane: a policy layer for AI memory. Full context now. Selective memory later.

---

Production notes: Keep the navy, blue and light background throughout. Use the existing Ava neural voice. Retain the visible prototype disclosure on the pipeline slide and in the demo; it is not part of the voiceover. Local rule filtering runs in the prototype. Jev, GBrain dispatch and training remain simulated. The video has not been regenerated.

Jev reference: https://typesafe.ai/blog/introducing-system-one-models-and-jev
