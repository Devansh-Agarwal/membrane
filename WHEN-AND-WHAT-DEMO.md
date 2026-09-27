# When & What — a company brain with boundaries

**Your AI should remember what matters—and respect what should stay private.**

Current demo direction, September 27, 2026. This supersedes the training-first presentation in the earlier build brief. Budget: 90 minutes building, 90 minutes producing the video. Synthetic data and simulated integrations are intentional. No application has been implemented by this document.

## The product

Use one **Memory** permission: whether the AI may remember and use a fact. Do not present remember and recall as separate product concepts or separate permissions. Audience and expiry are properties of an allowed memory. **Training** is a separate permission. Apply company rules plus individual preferences.

The headline question is **“What should our AI remember?”** RAG is how the application uses permitted memory. Training is a separate use with its own permission. “When” covers both when memory should expire and when approved behavior examples might justify a training experiment.

Present one Memory control with four simple states:

- **Don't remember** — exclude from the demo's AI memory and later retrieval.
- **This task only** — temporary context, cleared when the task ends.
- **Remember for me** — private memory for that person.
- **Remember for the team** — shared within the selected team.

Keep **May be used for training** as a separate permission. A team memory is not automatically a training example. Company prohibitions take precedence; people may tighten their own permissions.

## The two-minute story

### 0:00–0:20 — one message contains different kinds of information

Show a clearly synthetic Slack-style message:

> Maya: I'll be offline Friday for an oncology appointment. Ravi is covering enterprise escalations. Please keep my updates to three bullets.

Press **Review memories**. The message becomes three fact cards:

| Proposed fact | Decision | Audience | Training |
|---|---|---|---|
| Ravi covers enterprise escalations on Friday | Remember until Friday ends | Support team | No |
| Maya has an oncology appointment | Don't remember | None | No |
| Maya prefers three-bullet updates | Remember for me | Maya | No |

The contrast is useful information versus unnecessary personal detail within the same message. These decisions follow our fictional policy and fixture labels; they are not claims about a universal compliance standard.

### 0:20–0:45 — make the benefit visible

Ask as a teammate: **“Who's covering enterprise escalations Friday?”**

The assistant answers **“Ravi.”** Show the one approved memory used. Then ask **“Why is Maya away?”** The assistant says **“I don't have a retained reason.”** The medical detail is absent from the actual context assembled for this demo query.

This demonstrates future retrieval through our memory store. The synthetic source message remains a source fixture; we are not claiming to erase the originating Slack message or information already seen by another system.

### 0:45–1:10 — a preference changes the brain

Switch to Maya's owner view and apply the preset **“Don't retain my writing preferences.”** Her preference card leaves her memory. Repeat a query and show that it is absent from the new context payload.

A free-text box can display this natural-language request, but use a small set of supported rules under the hood. We do not need a general policy language to make the interaction convincing.

### 1:10–1:30 — memory expires

Advance an explicitly labeled **Demo clock** to Saturday. Ravi's temporary coverage fact expires and disappears from retrieval. The assistant no longer uses it to answer who is covering now.

This adds a visible, understandable meaning to “When.” No scheduling infrastructure is required: evaluate the fixture timestamp on reads.

### 1:30–1:50 — what may become learning?

Open **Learning preview**. A second source contains a team-approved escalation procedure and manually labeled synthetic routing examples. They are eligible training material. Maya's medical detail, private preference, expired coverage, and confidential customer pricing are excluded under this demo policy.

Show two recommendations: **Current customer pricing → retrieve when permitted** and **Consistent ticket routing → candidate training experiment**. Export the actual eligible fixture examples and their source IDs. Present recommendations as rules of thumb, not measured proof that training will improve the task.

### 1:50–2:00 — close

> When & What. The right memory, for the right person, for the right amount of time.

If a real River checkpoint has been trained and integrated, replace a few seconds of learning preview with its live classification and checkpoint ID. Otherwise keep it labeled as a preview.

## The one-screen interface

Left: synthetic message feed and the Review memories button.

Center: readable fact cards moving into Don't remember, This task only, Personal, and Team lanes. Each retained card has owner/audience and expiry badges. Training permission is a separate badge.

Right: Ask the brain, with a compact drawer showing the actual selected memory IDs and assembled context. Provide clearly labeled Maya/Teammate demo views.

Top: a small Demo data indicator. Bottom: two presentation controls, Advance to Saturday and Learning preview. Use simple card movement, highlighting, and close-up crops in the video.

The Don't remember lane displays a review proposal from the synthetic source. That display is not an entry in the assistant's recallable memory. The query code must read the memory store, not the whole source fixture or the review screen.

## What works versus what can be simulated

**Make these work in the local demo:** the single Memory permission, audience filtering, expiration, preference changes, context assembly, training-example filtering, and reset. Apply the same memory permission when saving facts and assembling answer context; the user does not configure two different permissions. These are small functions over JSON records and directly drive what appears on screen.

**Simulate as needed:** Slack import, people/accounts, enterprise policy setup, source classification/extraction, large-scale backfill, the clock, and integrations without working credentials. Label canned extraction as fixture mode and canned answers as scripted responses. Do not invent confidence values or provider job IDs.

Optional live calls can replace one boundary without changing the rest of the demo. A synthetic corpus is still compatible with real Jev calls or real River training. A generative answer is optional: a source-grounded answer template is enough for the fixed demo questions, provided its execution mode is clear.

Do not claim global deletion, universal data-loss prevention, or erasure from trained weights. The demonstrated boundary is this memory store and its generated payloads. That narrow scope is sufficient for the story.

## Sponsor strategy

**GBrain primary:** implement a small memory-admission/recall skill or adapter with these decisions and show an actual GBrain write/read. If the backend is simulated, claim a prototype integration rather than a completed extension.

**River stretch:** train a small structured-output classifier on reviewed synthetic examples if a working recipe is available early. A simulated training screen does not meet the supplied River side-quest requirement. Do not delay the core demo for it.

**QM alternative:** if an instance already runs, add the protected memory tool to a real fork. A standalone UI with QM branding is not the requested fork extension.

Keep Jev's typed-decision interface as the classifier design. A hosted classifier is still a data recipient; the demo's synthetic data avoids needing to resolve real enterprise deployment approval during the hackathon.

## Ninety minutes to build

| Minutes | Deliverable |
|---|---|
| 0–10 | Load the synthetic fixture and freeze the exact narrative. Check one integration if credentials already work. |
| 10–30 | Four memory lanes, fact cards, and admit/recall/expire/filter functions. |
| 30–50 | Ask-the-brain panel and actual context drawer; Maya/teammate views. |
| 50–65 | Preference change, demo clock, learning preview, and export. |
| 65–80 | Polish movement/readability and add one working sponsor integration if feasible. |
| 80–90 | Check the six demo behaviors, add reset, record a backup take, freeze features. |

If pursuing River, launch its candidate training run early while doing the UI work; don't discover the training API at minute 80.

Six behavior checks: medical fact never enters recall; teammate never sees Maya's private preference; permitted coverage is retrievable; preference removal affects the next query; expired coverage is excluded; training export includes only allowed examples. This is a demonstration of product behavior, not a classifier accuracy benchmark.

## Ninety minutes for the video

15 minutes rehearsal and script trimming; 20 minutes capture; 30 minutes edit/voiceover/captions; 25 minutes export, review, and submission. Aim for two minutes. One continuous capture should show a preference change and its effect on the next query so the core interaction is easy to trust.

Fixture: [when-and-what-memory.json](demo/when-and-what-memory.json). Earlier technical considerations remain in [the build brief](WHEN-AND-WHAT-BUILD-BRIEF.md).
