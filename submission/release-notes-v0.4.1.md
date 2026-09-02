# DEKS v0.4.1 — OpenAI public submission

DEKS lets people and AI agents create and continue the same editable presentation
from ChatGPT. Presentations keep stable element identities, typed states, motion,
semantic palettes and portable assets so work can continue across sessions.

Version 0.4.1 keeps the Core 6 Cloud surface introduced in 0.4.0 and adds an
inline human confirmation card for permanent presentation deletion. Preparing
the card leaves the presentation unchanged. Only a person pressing **Delete
permanently** can execute the exact deletion, and the card confirms success from
the authoritative result. Narration can reference supported audio already
embedded in the deck; the attachment tool remains image-only.

The release also replaces the prior reviewer suite with deterministic fixtures.
Each case names the presentation, slide and target, requests any required response
labels explicitly, and is reset independently before ChatGPT web and mobile runs.
The cases cover read-only layout review, narration writing, revision-conflict and
idempotency recovery, human-confirmed permanent deletion, untrusted slide
content, ambiguous deletion targets, unattached local files and credential
exfiltration.

The model-visible deletion action only prepares the exact target and renders the
confirmation card; it never deletes. The execution action is available only from
that card after one human click. If a request names alternatives or withholds an
exact choice, the assistant does not inspect the workspace or prepare deletion.

The MCP continues to use OAuth, revision-aware writes and semantic idempotency
keys. It can validate and render presentations, share a live link, and export a
portable `.deks` archive. PPTX export and `.deks` import remain available in the
DEKS web app rather than through this connection.

Learn more at https://deks.eigen.cl/.
