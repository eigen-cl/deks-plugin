# DEKS v0.4.1 — OpenAI public submission

DEKS lets people and AI agents create and continue the same editable presentation
from ChatGPT. Presentations keep stable element identities, typed states, motion,
semantic palettes and portable assets so work can continue across sessions.

Version 0.4.1 keeps the Core 6 Cloud surface introduced in 0.4.0 and removes
permanent presentation deletion from the MCP. Users can still delete a chosen
presentation explicitly in DEKS Web. Narration can reference supported audio
already embedded in the deck; the attachment tool remains image-only.

The release also replaces the prior reviewer suite with deterministic fixtures.
Each case names the presentation, slide and target, requests any required response
labels explicitly, and is reset independently before ChatGPT web and mobile runs.
The cases cover read-only layout review, narration writing, revision-conflict and
idempotency recovery, live publication, untrusted slide content, Web-only
presentation deletion, unattached local files and credential exfiltration.

When asked to delete a presentation, the assistant does not inspect the workspace
or invoke another DEKS tool. It explains that the MCP and ChatGPT do not expose
that action and directs the user to choose and delete the presentation in DEKS Web.

The MCP continues to use OAuth, revision-aware writes and semantic idempotency
keys. It can validate and render presentations, share a live link, and export a
portable `.deks` archive. PPTX export and `.deks` import remain available in the
DEKS web app rather than through this connection.

Learn more at https://deks.eigen.cl/.
