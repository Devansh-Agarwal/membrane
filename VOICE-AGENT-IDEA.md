# Call Your Agent

Candidate hackathon direction from your September 27 question: extend QM or GBrain so you can give work orders while using a car's hands-free audio. This is a proposed design; no calling service or integration has been deployed.

**Pitch: Call your agent, delegate work, and arrive to finished drafts.**

## How you reach it

Give the service a phone number saved as a contact. Use normal hands-free calling through a paired phone. This targets cars that support Bluetooth phone calls and keeps the service accessible outside the car too. Verify the microphone, speaker routing, and reconnection behavior in your particular car while parked.

Tesla documents Grok conversation and vehicle commands, but its public support page does not document attaching arbitrary QM/GBrain tools. A separate callable agent is the practical integration path to investigate. [Tesla support](https://www.tesla.com/support/grok).

Grok itself is available beyond Tesla: xAI's Speech to Speech API supports custom functions and MCP tools, and links to a Twilio phone-agent example. We could use Grok as the conversational layer. [xAI voice documentation](https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech).

## What already exists

GBrain ships an `agent-voice` reference with browser voice, an optional Twilio adapter, and a default read-only tool router. Live cross-call memory is listed as deferred. Its older `twilio-voice-brain` recipe redirects to this newer reference. Treat it as a starting point that needs integration and verification. [Current reference](https://github.com/garrytan/gbrain/blob/master/recipes/agent-voice.md), [older recipe](https://github.com/garrytan/gbrain/blob/master/recipes/twilio-voice-brain.md).

QM has scoped workspaces, a headless core with an HTTP API, durable sandboxes, and background work. Its exact request authentication and job interface must be checked in the chosen running instance before implementation. [QM repository](https://github.com/yc-software/qm).

## The extension to build

The new capability is **durable voice delegation**: a spoken instruction becomes a tracked job that survives the call, and a later call can recover its context and result.

Proposed flow:

```text
Car hands-free audio ↔ paired phone ↔ phone service
                                        ↕
                                Voice conversation
                                  ↙           ↘
                      GBrain: context       Job adapter → QM
                      and preferences           ↓
                                         Draft + status
                                               ↓
                                    Spoken recap / desktop view
```

The voice session and the worker have separate lifetimes. On acceptance, persist the job before acknowledging it. Return a short receipt, let the worker continue after hangup, and retrieve the result on the next authenticated call. Retry or reconnect must not create a duplicate job. Cancellation stops pending or running work where possible; it cannot undo an already-completed external action.

## Three capabilities for the MVP

1. **Brief me:** retrieve a short answer from a small GBrain demo corpus.
2. **Do this:** start one bounded task, such as preparing a customer follow-up draft from those notes.
3. **What happened?:** retrieve its status and a short result summary in a fresh call.

Use one owner, one workspace, and one task type. The application tool names and job lifecycle are our proposed interface, not claimed built-in QM endpoints.

Keep conversational answers short, allow interruption, and support “stop,” “repeat,” and “save the details for later.” Read back consequential parameters such as the person, project, and requested outcome before dispatch. For today's demo, save drafts for review; do not require the driver to inspect a screen.

## Demo sequence

- Call the agent from your phone while a laptop displays its workspace for the judges.
- Ask: “What did we promise Acme in the last meeting?” It retrieves the seeded note.
- Say: “Prepare a follow-up draft with our open items. Keep it under 150 words.”
- Hear a short accepted-job receipt. Hang up.
- Show the worker completing and saving the draft after the call ends.
- Call again: “Is that Acme draft ready?” It recognizes the previous job and gives a short recap.

This demonstrates continuity and execution with an observable artifact. The stage demonstration should be stationary.

## Solo build plan

Budget the 225 minutes approximately as: 35 minutes voice transport and credentials; 35 minutes GBrain recall; 65 minutes one durable job path; 40 minutes call-back continuity and result display; 50 minutes testing, polish, recording, and submission.

Prefer the voice reference's existing provider to avoid a provider migration during the event. If you specifically want Grok voice, start from xAI's phone example instead. Keep a browser-voice demo fallback if phone-number provisioning is slow, and label that transport honestly.

If a working QM deployment is unavailable early, build on GBrain with a small background worker and present it as a GBrain extension. Add QM only once an actual job can be submitted and its result retrieved. Avoid claiming a QM integration from a diagram alone.

## Before connecting real work

Authenticate the owner independently of caller ID, bind jobs to their workspace, and expose only bounded tools. The GBrain reference explicitly lists missing public-deployment controls, including authentication on its tool endpoint and Twilio signature checks; add those before exposing it. Twilio's bidirectional Media Streams provide the call-audio transport, not application authorization. [Twilio documentation](https://www.twilio.com/docs/voice/media-streams).

Remaining unknowns: your preferred phone transport, existing voice-provider credentials, a working QM/GBrain instance, phone-number provisioning, and actual car audio behavior. These affect implementation time, not the basic feasibility of the concept.
