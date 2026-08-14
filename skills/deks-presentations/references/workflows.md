# Reliable DEKS workflows

## Build a presentation

1. Use the production `create_presentation` tool with a semantic idempotency key and `expected_revision: 0`; capture its presentation ID, blank slide ID, dimensions, palette, and revision.
2. For an existing deck, call `list_presentations`, resolve it by name, confirm ambiguity with the user, and then call `get_presentation`.
3. Define a concise slide outline and element naming scheme before writing.
4. Compose the first slide. Use `apply_commands` when several elements form one intentional composition.
5. Create or duplicate the next slide. Continue persistent objects with `add_existing_element_state`.
6. Configure the adjacent transition and independent entry/exit motions.
7. Validate layout after each slide. Resolve objective errors and inspect warnings against the visual intent.
8. Re-read the final document, validate once more, and export only when requested.

## Edit without losing concurrent work

1. Read the current presentation immediately before the change.
2. Form one semantic transaction and give it a unique key such as `pricing-slide-realign-v1`.
3. Send the current revision.
4. On conflict, read again and decide whether the intended edit still applies. Never increment a revision by assumption.

## Delete only on explicit request

1. Confirm that the user explicitly asked to permanently delete the presentation.
2. Respect the production `delete_presentation` tool's destructive metadata.
3. Call `get_presentation` immediately before deletion.
4. Pass the returned `revision` and exact presentation `name` to `delete_presentation`.
5. Do not automatically retry after a timeout: the operation is intentionally non-idempotent and a successful deletion makes the deck not found.

## Preserve continuity

An element identity represents the same conceptual object across slides. Continue it when a title, logo, chart, orb, frame, or other object persists. Create a new identity only when the object is conceptually new. This gives DEKS enough information to animate shared geometry cleanly.

For presence motion:

- Destination-only element: `direction: "in"` on the transition into that slide.
- Source-only element: `direction: "out"` on the transition out of that slide.
- Shared element: rely on shared identity; use an override only for edge-specific timing or to disable its animation.

## Interpret layout validation

- `errors`: fix before delivery.
- Out-of-canvas geometry: fix unless the overflow is a deliberate, visible crop.
- Text/content bounds marked `estimated`: use as a conservative signal; do not describe them as browser measurements.
- Parent/child containment, progress fill over track, text over CTA background, and deliberate decoration can be intentional warnings. Verify each pair by element name and geometry.
- Do not dismiss a collision merely because it is visually small.

## Batch command shape

Each operation in `apply_commands.commands` contains `command`, the relevant IDs, and an `arguments` object. The outer call supplies the transaction's `expected_revision` and `idempotency_key`; do not put stale revision values inside operations.

Prefer a smaller coherent batch over one giant deck-wide batch. A failed batch changes nothing, which makes recovery and user-facing explanations clearer.
