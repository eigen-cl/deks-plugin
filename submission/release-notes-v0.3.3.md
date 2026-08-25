# DEKS v0.3.3 — OpenAI public submission update

This update keeps the same DEKS Cloud MCP connection and permissions while
improving how the bundled skills author presentations.

DEKS is a collaborative presentation format for people and AI agents working on
the same editable deck. The plugin connects to a user's DEKS Cloud workspace
through OAuth and can create presentations, edit individual elements, preserve
element identities across slides, apply semantic motion, render previews for
visual checks, share a live presentation, and export a portable `.deks` file.

Version 0.3.3 keeps text continuity unambiguous: unchanged copy may preserve one
element identity, but a new phrase, claim, or label requires a new text element
even when it reuses the same visual rectangle. The outgoing text must finish
before the incoming text begins. It also directs remote clients to compose a
coherent checkpoint or short narration in bounded `apply_commands` batches,
then validate and render that coherent result instead of making one remote call
per element or property.

The release adds regression cases for both rules and keeps expected revision,
idempotency, destructive-action, and visual-QA safeguards unchanged.

Reviewer tests use a synthetic workspace. The MCP can reuse existing assets and
upload a file explicitly attached by the user, then return an `asset_id` for image
elements. It never invents a file, path, or URL when no attachment is present.
The MCP cannot import a `.deks` file, export PPTX, or create native speaker notes.
The disposable deletion fixture must be re-seeded before any deletion test.
