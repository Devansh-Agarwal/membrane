# When & What: first presentation draft

Suggested delivery: about 2 minutes, with a short live demo after slide 3.

## 1. When & What

The agent needs context to do its job. But a useful conversation can contain details that should never become persistent company memory. When & What puts a small policy hook at the point where an agent tries to save memory. We call it memory surgery for your company’s AI.

## 2. One message, different memory rules

This synthetic message mixes a medical detail, work coverage and a writing preference. The agent keeps the full conversation for the immediate task. The memory policy excludes the medical detail, keeps coverage until Friday and marks the preference private. Training permission stays separate.

## 3. The memory write boundary

The UI has three parts: a Markdown rule file, an agent trajectory and intercepted memory calls. Run the hook and see exactly what it edits or blocks. It leaves the user and assistant messages alone. There is no manual approval queue.

**Live demo:** Load the sample rules and trajectory. Run the hook. Point to the medical sentence it removed, the coverage it retained and the secret it blocked.

## 4. One intercepted write

The agent attempted to store a mixed memory. The hook removes the sentence with the medical detail and keeps Ravi’s coverage. It adds the proposed audience, expiry and training metadata. This screen shows the outgoing intent. The dispatch to GBrain is simulated in this prototype.

## 5. A policy change takes one line

Maya changes her mind about writing preferences. Add `- Remember my writing preferences: no` to her file and run the trajectory again. That memory now gets blocked. The policy acts on subsequent writes. It does not erase previously stored facts or undo training.

**Live demo:** Add the line, rerun, and point to the writing preference changing to blocked.

## 6. The demo today

The rule parser and write interceptor work today. Local GBrain also works in separate save, recall and withdrawal checks. The next step connects the hook to actual storage and enforces audience and expiry during retrieval. This demo shows a small, understandable boundary that employees can control with a file.

## Presenter notes

- Use synthetic examples only in the video.
- Describe visibility and expiry as outgoing metadata until enforcement is connected.
- Say “withdraw from active recall” for GBrain withdrawal. Avoid “permanently erase.”
- Do not claim live Jev classification, River training, production compliance, or live GBrain dispatch from this UI.
- The simplest rules remove whole sentences. A sentence that mixes sensitive and useful content can lose both.
- Recheck slide 6 against the final app before recording. The implementation may advance after this draft.
