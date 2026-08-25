# DEKS v0.3.3 — portal copy sheet

Copy this material into a new **With MCP** draft. Keep the draft unsubmitted
until the blocking checklist in `openai-listing.md` is complete.

## Info

**Plugin name**

DEKS

**Developer identity**

EIGEN

**Category**

Productivity

**Short description**

Decks for people and AI agents

**Long description**

DEKS is a collaborative presentation format built for people and AI agents to
work on the same editable deck. Create a presentation, continue it across chats,
edit individual elements, and share one current version with your team. Stable
element identities let objects persist and transform between slides, while DEKS
motion adds reusable rhythms and transitions. The plugin connects ChatGPT or
Codex to a DEKS Cloud workspace through OAuth, uses revision-aware writes to
protect concurrent edits, renders slide previews for visual checks, and exports
a portable `.deks` file. It can reuse assets already in the workspace or upload
a file explicitly attached by the user, returning an asset ID that can be reused
throughout the deck. PPTX export remains in the web app.

**Spanish (Latin America) subtitle**

Crea y edita presentaciones

**Spanish (Latin America) description**

DEKS permite que personas y agentes de IA creen, revisen, editen, animen,
validen, publiquen y exporten una misma presentación editable desde ChatGPT.
Conserva la identidad de los elementos entre diapositivas, protege la
colaboración con escrituras basadas en revisión, reutiliza recursos del espacio
de trabajo o incorpora archivos adjuntos, renderiza vistas previas para revisar
la calidad visual y exporta archivos portables `.deks`.

**Website**

https://deks.eigen.cl/

**Support URL**

https://deks.eigen.cl/support/

**Privacy policy URL**

https://deks.eigen.cl/privacy/

**Terms of service URL**

https://deks.eigen.cl/terms/

**Logo**

Upload `assets/deks-icon.png`.

## MCP

**URL type**

Universal

**Production MCP URL**

https://api-deks.eigen.cl/mcp/

**Authentication**

OAuth

**Plugin UI / CSP / screenshots**

This version has no plugin UI. Do not upload screenshots. Leave CSP empty unless
the production Scan Tools result discovers a UI resource.

**Challenge URL after the portal supplies a token**

https://api-deks.eigen.cl/.well-known/openai-apps-challenge

**Tool annotations and justifications**

After Scan Tools completes, compare every imported value with
`openai-tool-annotations-v0.3.3.md` and paste its per-tool justification. Fix the
server and scan again if any value differs. Existing presentation mutations use
`openWorldHint: true` because a published DEKS link is a live view.

## Skills

Upload the final five-skill package tree:

1. `deks-presentations`
2. `deks-cloud-mcp`
3. `deks-desktop-mcp`
4. `design-deks-presentations`
5. `deks-motion-patterns`

## Starter prompts

1. Create a four-slide presentation in DEKS, then render it and fix any clipped text.
2. Continue my DEKS deck while preserving the changes my team already made.
3. Make one element persist and transform between two slides in my DEKS presentation.

## Testing

Paste the exact five positive and three negative cases from
`openai-review-cases-v0.3.3.json`. Do not shorten their expected behavior,
fixture, result shape, or safety rationale in the portal.

## Global

Start with Chile only after legal, terms, privacy, product, and support readiness
are confirmed. Add other countries only after the same review.

The current portal draft is configured to allow all supported countries. Review
that choice before submission; changing country availability is a product and
legal decision, not an automatic form-filling step.

## Reviewer access

Enter the dedicated reviewer email and password only in the portal's private
credential fields. Do not add them to this file. The account must work without
MFA, SMS, email confirmation, or private-network access.

## Release notes

Paste the complete contents of `release-notes-v0.3.3.md`.

## Final attestations

Leave the Terms, policy, legal, rights, ads, financial-action, and age-content
attestations unchecked until the accountable developer reviews and confirms
them. Never submit the draft automatically.
