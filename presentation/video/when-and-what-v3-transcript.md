# When & What — problem, Jev, then demo

Voice: Microsoft Ava Multilingual Neural.

## The memory adoption problem

Teams hesitate to adopt AI memory when they cannot control what it keeps. A debugging session mixes useful clues with credentials and customer data. Company restrictions and employee preferences overlap. Removing too much context weakens the task. Keeping everything creates risk. Retention and training need separate permission.

## Jev at the memory boundary

Our design puts Jev at the memory boundary. A local listener intercepts the trajectory and checks what may reach the classifier. Company policy and employee Markdown files supply the rules. Jev returns structured decisions with confidence. Our hook removes excluded spans and prepares clean facts and trajectories for G Brain, with a separate training permission gate. This prototype simulates Jev with local rules. Here is the demo.

## 01 / Use the full context

Checkout errors jump to eighteen percent after a deploy. The team shares database traces, customer details, and a temporary debug credential. The agent finds a connection leak. A rollback restores checkout. None of that working context is removed.

## 02 / Rules live in Markdown

Company policy excludes credentials and customer data. Maya adds her own preference: never retain raw request payloads. These are simple Markdown files. They control what enters lasting memory, separately from the live conversation.

## 03 / Filter the trajectory automatically

Now follow the agent's execution trace. Before persistence, the listener applies the rules to context, tool calls, and results. Five sensitive spans disappear. The pool saturation, diagnosis, rollback, and reusable fix remain. There is no manual review queue or save button.

## 04 / Keep the useful lesson

The cleaned incident is available in the demo memory. Next time, the agent can retrieve the procedure: inspect the pool, check retries, roll back, and release connections correctly.

## 05 / Retrieval or a training pilot?

Across incidents, the same procedures start repeating. Repeated patterns suggest a training pilot. One-off incidents stay in retrieval. Only permitted examples enter the export. These are learning signals, not proof that training beats retrieval.

## 06 / The employee stays in control

Maya can turn training permission off with one line. Apply the change, and permitted training examples fall to zero. The useful incident memory stays. Permission to remember is separate from permission to train.

## Full context now. Selective memory later.

The rule filtering works locally. Jev, GBrain dispatch, and training are simulated in this prototype. When and What. Remember the fix, not the secrets.

Jev reference: https://typesafe.ai/blog/introducing-system-one-models-and-jev

The first slide is the product thesis, not a market-adoption statistic. The prototype uses deterministic local rules, with Jev classification and GBrain dispatch simulated.
