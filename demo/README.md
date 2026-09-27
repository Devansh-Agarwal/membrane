# Synthetic meeting-to-task cases

All people, meetings, and policies in this folder are fictional. This is preparation data for a possible demo, not collected customer work or measured model output.

`meeting-cases.jsonl` has 12 records: one `teach`, seven `regression`, and four `held_out`. Each line is independent JSON. `expected_subset` contains fields to compare against the worker's structured response; `note` is the only task input. The optional `correction` is teaching material for the skill-update generator.

## Demo team convention

A task is ready to queue only after its named owner accepts responsibility. A request alone does not commit the requested person. Missing ownership requires clarification. Brainstorming and cancelled work are not actionable. An unmet prerequisite blocks readiness even when the owner has accepted. A missing deadline does not block an otherwise accepted task. Preserve explicitly supplied deadlines without inventing one.

`owner` records the accepting person, so a proposed or unaccepted owner remains null. A non-actionable item has no active owner or due date; a mentioned event date in a brainstorming idea is not a task deadline. Evidence must quote the source and support the decision.

The policy is the evaluation target. Establish the baseline without this newly taught convention if testing learning from that correction; do not include the expected answers in the worker prompt. Freeze baseline settings and all other context before comparing candidate versions.

## Run discipline

1. Measure and save the baseline on teaching and regression inputs.
2. Generate a candidate from the teaching case and correction only.
3. Rerun teaching and regression inputs under the candidate.
4. Gate on the corrected example and preservation of all previously passing regression cases.
5. Choose the candidate, then run the four reserved cases. Keep these out of skill generation and tuning. The builder can inspect this preparation file, but the optimization loop must not use reserved inputs or labels.
6. Display actual results, including failures. If revising after inspecting reserved results, create new reserved examples before making another transfer claim.

These cases test decision semantics, not robust natural-language understanding or production readiness. They need manual review before use. Actual model calls and tests have not been run.
