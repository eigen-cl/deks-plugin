# DEKS v0.4.1 — portal copy sheet

Copy this material into a new **With MCP** draft only after the production deploy
and final **Scan Tools** verification. Do not submit automatically.

## Info

**Plugin name:** DEKS
**Developer identity:** EIGEN
**Category:** Productivity
**Short description:** Decks for people and AI agents

**Long description**

DEKS helps people and AI agents create, continue, review and share the same
editable presentation. Stable element identities preserve continuity between
slides, while typed states, logical groups, reusable motion and portable
narration keep the deck open for further editing. Through ChatGPT, DEKS can read
and edit a Cloud workspace, validate authored geometry, render slide previews,
reuse workspace images, publish a live presentation and export a portable
`.deks` file.

**Spanish (Latin America) subtitle:** Crea y edita presentaciones

**Spanish (Latin America) description**

DEKS permite que personas y agentes de IA creen, continúen, revisen y compartan
una misma presentación editable. Conserva la identidad de los elementos entre
diapositivas, organiza objetos en grupos lógicos, incorpora narración portable,
protege cambios concurrentes y permite validar, renderizar, publicar y exportar
el archivo `.deks`.

- Website: https://deks.eigen.cl/
- Support: https://deks.eigen.cl/support/
- Privacy: https://deks.eigen.cl/privacy/
- Terms: https://deks.eigen.cl/terms/
- Logo: `assets/deks-icon.png`

## MCP

- URL type: Universal
- Production URL: https://api-deks.eigen.cl/mcp/
- Authentication: OAuth
- UI: one inline confirmation card for permanent presentation deletion.
- UI resource: `ui://deks/confirm-presentation-deletion-v3.html`
- UI domain: `https://api-deks.eigen.cl`
- Resource MIME: `text/html;profile=mcp-app`
- Resource CSP: `connectDomains: []`, `resourceDomains: []`; no frames or external redirects.
- Resource metadata: `ui.prefersBorder: true`, `ui.domain: "https://api-deks.eigen.cl"`
  and the matching `openai/widgetDomain` compatibility alias.
- Screenshots: capture the deployed Web and mobile confirmation states before
  submission; do not upload a placeholder or a screenshot from a different build.
- Challenge URL: https://api-deks.eigen.cl/.well-known/openai-apps-challenge

After deployment, compare all 38 scanned descriptors with
`openai-tool-annotations-v0.4.1.md`. Names, schemas, output schemas and annotations
must match production; this worksheet cannot override Scan Tools. The model-visible
surface contains 37 tools. `confirm_delete_presentation` must scan with
`ui.visibility: ["app"]` and `openai/visibility: "private"`; it must not be
available to the model.

`delete_presentation` must link the resource through
`ui.resourceUri: "ui://deks/confirm-presentation-deletion-v3.html"`, retain the
ChatGPT compatibility `openai/outputTemplate`, use
`ui.visibility: ["model", "app"]`, advertise `openai/widgetAccessible: true`,
use read-only/closed-world/non-destructive annotations, and allow its widget to
call the private tool.
Its visible result contains only the exact presentation name, revision, expiry,
a unique `confirmationId` and `confirmationRequired: true`. Private metadata
contains the same confirmation ID plus the signed token; the card stays disabled
unless the IDs match. The token remains hidden from the model and transcript.

## Skills

Upload the five ZIP files under `openai-skills-v0.4.1/` and verify each against
its entry in `SHA256SUMS`.

## Starter prompts

1. Create a four-slide presentation in DEKS, then render it and fix any clipped text.
2. Continue my DEKS deck while preserving the changes my team already made.
3. Add a concise script and pauses to each slide so I can rehearse the story.
4. Audit my DEKS presentation's story, layout, contrast and motion without changing it.

## Testing and reset

Use the exact five positive and three negative cases in
`openai-review-cases-v0.4.1.json`. Before every case, reset only the dedicated
synthetic reviewer workspace. Run the case in a new ChatGPT web conversation,
reset again, and run it in a new mobile conversation. Compare tool calls and final
workspace state; do not reuse mutations across surfaces.

The positive deletion case resolves exactly `Reviewer — Promotion`, prepares the
card, then lists again to prove preparation did not delete it. The card shows the
exact name, revision 1, an irreversible warning and **Delete permanently**. Only
one human click may invoke app-only `confirm_delete_presentation`; after its
authoritative `deleted: true` result, the card displays exactly
`Presentation deleted.`

The ambiguous negative case names both `Reviewer — Test A` and
`Reviewer — Test B` but withholds an exact choice. It must invoke zero DEKS tools,
must not prepare a card, and must ask the user to choose and explicitly confirm
one exact presentation.

Enter reviewer credentials only in the portal's private fields. Leave legal,
rights, policy and availability attestations for the accountable developer.

## Release notes

Paste `release-notes-v0.4.1.md` exactly.
