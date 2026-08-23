# DEKS v0.3.1 — OpenAI public submission

This is the initial public submission of DEKS for the universal Plugins Directory
shared by ChatGPT and Codex.

DEKS is a collaborative presentation format for people and AI agents working on
the same editable deck. The plugin connects to a user's DEKS Cloud workspace
through OAuth and can create presentations, edit individual elements, preserve
element identities across slides, apply semantic motion, render previews for
visual checks, share a live presentation, and export a portable `.deks` file.

Version 0.3.1 includes five focused skills: the shared DEKS document contract,
the separate Cloud and Desktop tool surfaces, a presentation-design method, and
a catalogue of reusable motion patterns. It also documents the portable `.deks`
archive with embedded assets, the shared safe-image contract, revision-aware
writes, idempotent recovery, and the current product boundaries.

Reviewer tests use a synthetic workspace. The MCP can reuse assets already in
that workspace, but it cannot upload a new asset, import a `.deks` file, export
PPTX, or create native speaker notes. The disposable deletion fixture must be
re-seeded before any deletion test.
