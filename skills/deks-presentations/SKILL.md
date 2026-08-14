---
name: deks-presentations
description: Create, edit, animate, inspect, validate, and export evidence-backed presentation stories through the DEKS MCP server. Use when an agent must work on a DEKS deck, develop its narrative and claims, preserve element identities across checkpoints, choreograph motion, perform honest geometry or rendered QA, recover concurrent or uncertain writes, or export a portable .deks archive.
---

# DEKS presentations

Use the DEKS MCP as the source of truth. Never infer the current revision, slide IDs, element IDs, or geometry from an earlier response after a write.

Use the client's OAuth connection for public or shared installations. Use a workspace PAT only for an explicitly configured development or direct CLI connection, and never request a token in chat.

## Choose the flow

- Inspect or edit an existing deck: start with `list_presentations`, then `get_presentation`.
- Build a new deck: use the production `create_presentation` tool with `expected_revision: 0`, then continue from the returned blank slide and revision.
- Use a new image: ask the user to upload it in DEKS first. The current MCP does not upload assets.
- Need exact inputs or the complete tool map: read [references/tools.md](references/tools.md).
- Need narrative, composition, motion, or batching guidance: read [references/workflows.md](references/workflows.md).
- Need factual claims, sources, or editorial framing: read [references/editorial-quality.md](references/editorial-quality.md).
- Need geometry or visual QA: read [references/visual-qa.md](references/visual-qa.md).
- Need conflicts, 429/5xx, timeouts, or partial-build recovery: read [references/recovery.md](references/recovery.md).

## Frame the story before writing

1. State the audience, desired decision, expected duration, narrative spine, and evidence needs.
2. Create a claim ledger. Mark each important assertion as sourced, inference, estimate, or unresolved.
3. Storyboard checkpoints as changes in a persistent visual world. Ask what moves, changes state, enters, or exits; do not default to replacing the whole scene.
4. Keep one background treatment across a sequence unless a semantic scene change justifies another. DEKS checkpoints are a timeline, not a stack of unrelated canvases.
5. Identify persistent element names and IDs before composing. Add at most one or two new focal ideas per checkpoint.

## Work safely

1. Read the presentation immediately before planning mutations.
2. Preserve stable element identities when an object continues across slides. Use `add_existing_element_state`; do not create a visually identical replacement.
3. Send the exact latest `expected_revision` with every mutation. After each successful write, use the returned revision for the next write.
4. Generate a unique semantic `idempotency_key` per intended transaction. Reuse it only when retrying that same transaction.
5. Prefer `apply_commands` for an atomic group of related edits. Keep a batch at or below 100 operations.
6. Never delete a presentation, slide, or element unless the user explicitly requested that destructive change. Before the production `delete_presentation` tool, re-read the presentation and require both its current revision and exact name. Respect its destructive annotation and never retry it automatically.
7. Run `validate_layout` after each completed checkpoint and after the whole deck. Treat errors as blockers. Inspect every warning and keep overlaps only when element names and geometry make the intent clear.
8. Render every checkpoint with `render_slide_preview` at the current revision, inspect the ordered sequence, and iterate. Do not equate geometry validation with visual review.
9. Re-read the presentation and summarize the final revision, QA level reached, remaining intentional warnings, and unsupported requests.

## Compose slides

- Design on the presentation canvas returned by `get_presentation`; DEKS uses absolute coordinates.
- Establish hierarchy with a restrained palette, one focal point, consistent margins, and readable type. Use Poppins or Roboto, the supported font families.
- Ask `recommend_palettes` for the story intent and mode; apply a complete recommendation with its paired foreground roles, then verify the rendered contrast.
- Use `list_icon_catalog` to choose semantic offline icons. Create them as native `icon` elements with `icon_family`, `icon_name`, and `color`; never fetch arbitrary SVG at runtime.
- Name elements semantically so later editing is reliable: `Hero title`, `Metric 37 percent fill`, `Source note`, not `Rectangle 12`.
- Use `shape_fill` for solid or linear-gradient shapes. Use `#RRGGBB` colors.
- Keep content inside the canvas. Avoid accidental text/shape, text/text, and CTA collisions. A warning from `validate_layout` is evidence to inspect, not automatic permission to ignore it.
- Cite material external claims visibly on the slide or in a source note. DEKS has no native speaker-note or citation-metadata field.

## Choreograph motion

- Set a presentation motion beat first; use duration multipliers instead of arbitrary durations.
- Use shared identity for morph-like continuity between adjacent slides.
- For elements present on both slides, configure `set_transition_override` only when the edge needs timing different from the shared transition.
- For an element present only on the destination, use `set_element_transition_motion` with `direction: "in"`.
- For an element present only on the source, use it with `direction: "out"`.
- Prefer `ease-out` for entrances and `ease-in` for exits. Keep stagger deliberate and short.
- Use motion to show causality, continuity, or a change of state. Do not animate merely because a checkpoint changed.
- Supported presence presets are `none`, `fade`, `glide-top`, `glide-right`, `glide-bottom`, and `glide-left`. Supported multipliers are `0.5`, `0.75`, `1.0`, `1.5`, and `2.0`.

## Recover and deliver

- Journal the pre-write revision, semantic operation, idempotency key, and returned transaction/revision for each batch.
- If a write returns a conflict, 429, 5xx, timeout, or transport failure, do not blindly issue a new mutation. Re-read first and follow [references/recovery.md](references/recovery.md).
- Use `undo_transaction` for a known mistaken MCP transaction instead of manually guessing inverse commands.
- Use `export_deck` only after final validation. It returns a base64-encoded `application/vnd.deks+zip` archive and a filename ending in `.deks`.
- Never paste the export base64 into chat. Save or transfer it through the artifact path supported by the client.
- Never expose the workspace PAT in chat, logs, generated files, or command output.
