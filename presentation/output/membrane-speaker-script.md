# Membrane — three-minute walkthrough

Use `membrane-final.pptx`. The incident chat and agent trajectory are separate slides with their actual product headings. The deck also contains detailed speaker notes.

## 1. Useful context. Selective memory. — 0:00–0:20

An incident chat contains what an agent needs right now, but also information that should never become company memory or training data.

Membrane separates those decisions. Keep the authorized context for the current task. Apply company rules and personal preferences to what survives.

## 2. The pipeline — 0:20–0:45

We put a listener before memory writes and trajectory storage. Two Markdown files define the rules. The hook classifies and removes excluded content, then prepares useful facts and a cleaned trace for GBrain.

Training has a separate permission gate. Local rules run in this demo; Jev classification and the GBrain handoff are simulated.

## 3. Incident chat — 0:45–1:10

Checkout errors jump after a deploy. Maya, Ravi and Lena share a customer email, revenue, credentials and a raw request while debugging.

The agent finds a connection leak. The team rolls back and identifies the fix. All that context remains available while they solve the incident.

## 4. Agent trajectory — 1:10–1:35

Here is what can survive. Five sensitive spans are removed automatically. The useful tool result, diagnosis and resolution remain.

There is no approval queue or save button. The listener applies the rules to the persistent copy while the original chat stays intact.

## 5. Rules and personalization — 1:35–1:55

The company excludes credentials, customer emails and revenue. Maya adds raw request payloads. These are small Markdown files that anyone can edit.

The next replay and export use the updated rules. Previously stored records and trained models require separate handling.

## 6. Repeated work — 1:55–2:20

Across nine synthetic incidents, two procedures repeat: pool exhaustion and retry storms. The seeded token ledger totals about 104,000 tokens.

Seven example records pass the repeat threshold and consent checks. This is a signal to investigate a training pilot, not proof that training will improve the model.

## 7. Permission before training — 2:20–2:45

Changing company facts stay in governed retrieval. Stable procedures may become training candidates. We would compare the pilot against RAG on new incidents.

If Maya changes “Allow training” to “no,” the next export goes from seven eligible records to zero. That controls future data use; it does not untrain a model.

## 8. Close — 2:45–3:00

The fix survives. The sensitive details don't.

We have working rules, automatic redaction and a consent-filtered JSONL export. Jev, live GBrain writes and a custom-model training pilot are the next connections.

## Optional live-demo transitions

- Slide 3: open <http://127.0.0.1:4320/?present&view=chat>, then click **Replay incident**.
- Slide 4: switch to **Agent trajectory**, then click **Replay redaction**.
- Slide 5: open **Memory rules** to show the two Markdown files.
- Keep slides 6–7 for the explanation if time is short. The fixture figures include the current incident after its replay completes.

## Presenter reference

- Every incident, credential and token count is synthetic.
- The redactor is deterministic. Jev is the intended typed classifier, not the component currently doing the cleaning.
- The UI's GBrain handoff is simulated. Local GBrain has been verified separately.
- JSONL export works. No custom model is trained, and no accuracy, latency or cost improvement has been measured.
- The seven exported fixture records repeat a small set of templates. They illustrate selection and consent, not a sufficient training dataset.
