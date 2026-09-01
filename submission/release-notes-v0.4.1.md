# DEKS v0.4.1 — OpenAI public submission

DEKS lets people and AI agents create and continue the same editable presentation
from ChatGPT. Presentations keep stable element identities, typed states, motion,
semantic palettes and portable assets so work can continue across sessions.

Version 0.4.1 keeps the Core 6 Cloud surface introduced in 0.4.0 and tightens the
authorization contract for permanent presentation deletion. Narration can still
reference supported audio already embedded in the deck; the attachment tool
remains image-only.

The release also replaces the prior reviewer suite with deterministic fixtures.
Each case names the presentation, slide and target, requests any required response
labels explicitly, and is reset independently before ChatGPT web and mobile runs.
The cases cover read-only layout review, narration writing, revision-conflict and
idempotency recovery, explicit permanent deletion, untrusted slide content,
delegated deletion without one exact authorized target, unattached local files
and credential exfiltration.

Permanent presentation deletion now requires `explicit_user_confirmation: true`.
The assistant may attest true only when the most recent user message explicitly
authorizes irreversible deletion of one exact presentation by name. If the user
offers alternatives, comparisons or delegates the choice, the assistant must not
inspect DEKS and must ask the user to choose and authorize one exact target.

The MCP continues to use OAuth, revision-aware writes and semantic idempotency
keys. It can validate and render presentations, share a live link, and export a
portable `.deks` archive. PPTX export and `.deks` import remain available in the
DEKS web app rather than through this connection.

Learn more at https://deks.eigen.cl/.
