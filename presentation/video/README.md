# When & What — ops demo video

- `when-and-what-demo.mp4`: 1080p H.264 video with synthetic narration and burned-in captions.
- `when-and-what-demo.srt`: editable caption file.
- `NARRATION.md`: narration script.
- `index.html`: local video player with download links.

The video follows the current Presentation chat's two-screen approach: untouched
team conversation, then a separate structured agent trajectory that is redacted
automatically. It adds rules, retained incident knowledge, learning signals, and
an employee training opt-out. No save button or manual review queue is shown.

All incident data is synthetic. Deterministic filtering works locally; Jev,
GBrain dispatch, and training remain simulated. The replacement voice is Microsoft Ava Multilingual Neural, generated through
the Edge online speech service. Only the synthetic narration script is sent for
synthesis; customer data and API credentials are not used.

The current cut uses one blue, white, and navy theme and the same four navigation
tabs throughout: Incident chat, Agent trajectory, Clean memory, Learning signals.

## Recreate the video

From the project root:

```sh
.local/video-tts/bin/python presentation/video/prepare-neural.py
node presentation/video/record.mjs
python3 presentation/video/render.py
```

`story.json` contains the script. `prepare-neural.py` creates neural narration and sentence timing for each chapter.
`record.mjs` captures a frozen in-memory copy of the current presentation assets
with Playwright. The recording makes real UI interactions. Camera-only CSS fits
content above captions, and replay animations are slowed for readability; neither
changes persisted app files or filtering results. `render.py` aligns narration and
captions with actual chapter timestamps, then exports MP4 using FFmpeg.

The scripts require FFmpeg, the project-local `edge-tts` environment, and the bundled
Playwright dependency referenced in `record.mjs`. Chrome capture and online speech
synthesis may require permission to run outside a process sandbox. No user browser
profile is accessed. Speech client: https://github.com/rany2/edge-tts.

`when-and-what-demo-v2.mp4` is the revised cut. The preview page links to it to avoid
reusing the browser cache for the first video. The original cut is retained in
`.local/video-v1` at the project root.

## Problem → Jev → demo opening (version 3)

The latest video replaces the first title card with two narrated slides:

1. The memory adoption problem: mixed context, overlapping policies, and separate retention/training permissions.
2. The Jev pipeline: trajectory → local listener → structured Jev decisions → policy hook → GBrain.

`opening/when-and-what-opening.pptx` contains the two editable slides. The PNGs in
`opening/` are rendered from that final PowerPoint. Jev's proposed role is sourced
to TypeSafe's introduction in the slide notes, and the simulated implementation
is disclosed on slide 2. The adoption argument is the product thesis, not a
measured market statistic.

The demo footage and Ava narration after the opening are preserved from version 2.
To rebuild this composition:

```sh
.local/video-tts/bin/python presentation/video/opening/prepare.py
python3 presentation/video/opening/render.py
```

The result is `when-and-what-demo-v3.mp4` with `when-and-what-demo-v3.srt`.

## Membrane handoff

Use `MEMBRANE-TRANSCRIPT.md` as the editable source for the next narration. Timestamps currently refer to v3. Preserve `when-and-what-v3-transcript.md` as the exact transcript of the existing cut.

The two opening slides are `opening/membrane-opening-v2.pptx`; the complete deck is `../output/membrane-final.pptx`. UI branding and `title.html` now use Membrane. The MP4 has not been regenerated. After transcript edits, synchronize the spoken paragraphs into the story JSON files, generate narration, and record the updated UI. Do not reuse the v2 demo segment: its baked-in branding and closing voice still say When & What.
