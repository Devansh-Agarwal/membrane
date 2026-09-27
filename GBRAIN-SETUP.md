# GBrain: local demo foundation

Verified on September 27, 2026. GBrain **0.59.0.0**, official `garrytan/gbrain`
source pinned at `e78f1c38b947b053f3a46881340f74f316be855a`.

## What works

- Local PGLite database, initialized to schema 165.
- Explicit saving and recall across separate CLI processes.
- Explicit correction by withdrawing the old fact and saving its replacement.
- Withdrawal from active recall. Historical records remain.
- Keyless operation: no embedding, extraction, or answer-generation provider configured.

The database is ready for on-demand commands; no background server is required.
This has not registered an MCP server with Codex or connected a hosted account.

## Run it

From this project directory:

```bash
./scripts/gbrain --version
./scripts/gbrain recall demo/when-and-what --json
bun --no-env-file scripts/check-gbrain.ts
```

The retained setup fact is synthetic:

> Ravi covers enterprise escalations on Friday, October 2, 2026.

It is private to the trusted local CLI and expires at `2026-10-03T07:00:00Z`.
The medical detail in the source fixture was not imported into GBrain.
This initial check manually selected the approved fact; no automated policy gate
or classifier has been built yet.

The check script creates uniquely named synthetic facts, verifies readback in
separate processes, then withdraws them. It does not alter the retained coverage fact.

## Where things live

| Item | Location |
| --- | --- |
| Project launcher | `scripts/gbrain` |
| Pinned source + dependencies | `.local/gbrain/` |
| Isolated configuration + database | `.local/brain-home/.gbrain/` |
| Dependency download cache | `.local/bun-cache/` |
| Latest diagnostics | `.local/gbrain-doctor.json` |

`.local/` is ignored by Git. The launcher sets `GBRAIN_HOME` to this project's
state directory, disables automatic service installation, and clears common
inherited model API keys. Automatic personal-memory capture remains off.
This is a convenient demo launcher, not an enterprise security boundary.

Search uses the conservative result budget selected for keyless setup. No
downstream LLM is connected. Doctor may report warnings about missing embeddings,
optional skills, a retrieval-reflex server, and the database being inside an
ignored project directory. Those optional features are outside this setup.

## Recreate the local installation

Requires Git and Bun 1.3.11 or newer. With this project's scripts present:

```bash
git clone --depth 1 --branch latest-stable https://github.com/garrytan/gbrain.git .local/gbrain
git -C .local/gbrain fetch --depth 1 origin e78f1c38b947b053f3a46881340f74f316be855a
git -C .local/gbrain checkout --detach e78f1c38b947b053f3a46881340f74f316be855a
bun install --cwd .local/gbrain --frozen-lockfile --ignore-scripts --cache-dir ../bun-cache
chmod +x scripts/gbrain
./scripts/gbrain init --pglite --no-embedding --db-only
bun --no-env-file scripts/check-gbrain.ts
```

`--db-only` avoids claiming the parent Git repository as GBrain's content
repository. It is sufficient for explicit memory operations. Shared publication
and canonical Markdown export are later work.

## The smallest useful demo to build next

1. **Use now.** Show a synthetic message and the complete context for the current task.
2. **Choose what persists.** Keep “Ravi is covering” and exclude the medical reason.
   Initially use visible, authored policy rules. Write only the permitted fact to GBrain.
3. **Ask again.** Start a fresh context and show the exact recalled facts. Coverage
   is available; the medical reason is absent. Withdraw a saved preference and
   show its effect on the next query.

Keep training as a separate permission and later stretch feature. A River
classifier or trajectory-based training recommendation can be added once this
single memory loop is clear and works end to end. All content is synthetic.

Reference: [official GBrain repository](https://github.com/garrytan/gbrain).
