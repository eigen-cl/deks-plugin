# DEKS v0.4.0 — OpenAI public submission

DEKS lets people and AI agents create and continue the same editable presentation
from ChatGPT. Presentations keep stable element identities, typed states, motion,
semantic palettes and portable assets so work can continue across sessions.

Version 0.4.0 updates the Cloud connection to the Core 6 document contract. It
adds logical element groups, normalized anchors, diamond shapes, exact text
padding, the complete paged Lucide 1.34.0 catalog, and portable slide narration
with a script and before/after pauses. Narration can reference supported audio
already embedded in the deck; the attachment tool remains image-only.

The release also replaces the prior reviewer suite with deterministic fixtures.
Each case names the presentation, slide and target, requests any required response
labels explicitly, and is reset independently before ChatGPT web and mobile runs.
The cases cover read-only layout review, narration writing, revision-conflict and
idempotency recovery, explicit permanent deletion, untrusted slide content,
ambiguous deletion, unattached local files and credential exfiltration.

The MCP continues to use OAuth, revision-aware writes and semantic idempotency
keys. It can validate and render presentations, share a live link, and export a
portable `.deks` archive. PPTX export and `.deks` import remain available in the
DEKS web app rather than through this connection.

Learn more at https://deks.eigen.cl/.
