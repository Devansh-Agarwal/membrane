# Membrane — a policy layer for AI memory

A local prototype that filters sensitive details from agent memory while preserving useful incident knowledge. Built for the Own Your Intelligence hackathon.

## Run locally

Install [Bun](https://bun.sh), then run:

```sh
git clone https://github.com/Devansh-Agarwal/membrane.git
cd membrane
bun run dev
```

Open **http://127.0.0.1:4310**. The demo has no package dependencies and requires no API keys. All incident data is synthetic; Jev classification, the UI's GBrain handoff, and model training are simulated. The optional GBrain CLI setup is documented separately below.

See the [presentation and demo video](presentation/README.md) for shareable project materials.

## Project notes

Current demo: an ops incident replay that keeps diagnoses and fixes while filtering credentials, customer details, and raw debug payloads. The Markdown memory hook is at `/hook`. Run `bun run dev` and open http://127.0.0.1:4310. See [the demo guide](DEMO.md).

Prepared September 27, 2026 for a likely solo build, prioritizing a polished demo.

- [Local GBrain setup](GBRAIN-SETUP.md) — working local memory foundation, commands, verification, and the smallest next demo
- [When & What: a company brain with boundaries](WHEN-AND-WHAT-DEMO.md) — earlier concept: selective memory, private recall, expiration, and training permissions; includes a two-minute storyboard and synthetic fixture
- [When & What: earlier technical brief](WHEN-AND-WHAT-BUILD-BRIEF.md) — policy mechanics and side-quest requirements
- [QM × GBrain × River: weaknesses and eight demo directions](DEMO-OPPORTUNITIES.md) — latest comparative analysis; recommends The Apprentice with a tested capability-transfer finale
- Detailed source reviews: [QM](QM-RESEARCH.md), [GBrain](GBRAIN-RESEARCH.md), [River](RIVER-RESEARCH.md)
- [Today's prep and ranked ideas](HACKATHON-PREP.md)
- [Call Your Agent: voice orders from the car](VOICE-AGENT-IDEA.md) — latest direction under exploration
- [Teachback: recommended build brief and demo script](TEACHBACK-BUILD-BRIEF.md)
- [Synthetic demo cases and evaluation rules](demo/README.md)

GBrain now runs locally with an isolated PGLite database. Synthetic save, recall, correction, and withdrawal checks pass. A one-page hook playground now edits or blocks memory-write payloads using simple Markdown rules. Its final GBrain write is simulated; no hosted sponsor connection or model training is used. Scores and feasibility judgments in the briefs are planning estimates, not official judging criteria.
