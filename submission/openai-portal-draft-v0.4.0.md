# DEKS v0.4.0 — portal copy sheet

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
- UI: none; leave screenshots and CSP empty unless the final scan discovers a UI resource.
- Challenge URL: https://api-deks.eigen.cl/.well-known/openai-apps-challenge

After deployment, compare the 37 scanned tools with
`openai-tool-annotations-v0.4.0.md`. Names, schemas, output schemas and annotations
must match production; this worksheet cannot override Scan Tools.

## Skills

Upload the five ZIP files under `openai-skills-v0.4.0/` and verify each against
its entry in `SHA256SUMS`.

## Starter prompts

1. Create a four-slide presentation in DEKS, then render it and fix any clipped text.
2. Continue my DEKS deck while preserving the changes my team already made.
3. Add a concise script and pauses to each slide so I can rehearse the story.
4. Audit my DEKS presentation's story, layout, contrast and motion without changing it.

## Testing and reset

Use the exact five positive and three negative cases in
`openai-review-cases-v0.4.0.json`. Before every case, reset only the dedicated
synthetic reviewer workspace. Run the case in a new ChatGPT web conversation,
reset again, and run it in a new mobile conversation. Compare tool calls and final
workspace state; do not reuse mutations across surfaces.

Enter reviewer credentials only in the portal's private fields. Leave legal,
rights, policy and availability attestations for the accountable developer.

## Release notes

Paste `release-notes-v0.4.0.md` exactly.
