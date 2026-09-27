# Chat and agent trajectory — separate presentation screens

Two independent screenshots, with no manual save step:

1. [Team chat](01-team-chat.jpg): the untouched incident conversation.
2. [Redacted agent trajectory](02-redacted-trajectory.jpg): structured context, tool calls, tool results and the resolution. The listener removes five sensitive spans automatically.

Open the [chat screen](http://127.0.0.1:4320/?present&view=chat) or the [trajectory screen](http://127.0.0.1:4320/?present&view=trajectory). Use the two tabs to switch between them. **Replay redaction** shows the filter processing each execution event in order.

Both screenshots are 1920 × 1080. **Move cards** lets you reposition the main window before taking another screenshot. **Reset positions** restores its placement.

Redaction runs locally against synthetic fixtures. Jev classification and GBrain handoff are simulated. The UI does not need a Save to GBrain button.

To start the local server:

```sh
PORT=4320 bun --no-env-file server/index.ts
```

Earlier PNG files are retained as design drafts; use the two images linked above for the current presentation.
