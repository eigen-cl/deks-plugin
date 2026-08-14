# Reliable DEKS workflows

## Build a presentation

1. Define audience, desired decision, duration, narrative spine, and evidence needs. Read [editorial-quality.md](editorial-quality.md) when claims matter.
2. Use the production `create_presentation` tool with a semantic idempotency key and `expected_revision: 0`; capture its presentation ID, blank slide ID, dimensions, palette, and revision. For an existing deck, list, resolve, and read it first.
3. Write a checkpoint storyboard. For every checkpoint, list persistent elements, changes of state/geometry, entering elements, exiting elements, and the single focal idea.
4. Establish one visual world: canvas direction, background treatment, margins, type scale, palette, and element naming scheme. Prefer left-to-right or top-to-bottom causality.
5. Scaffold blank checkpoints before composing so `create_slide` cannot clone a populated predecessor accidentally.
6. Compose the opening checkpoint with an atomic batch. Continue persistent objects with `add_existing_element_state`; create a new identity only for a new concept.
7. Configure the adjacent transition. Let shared geometry tell the story; use entry/exit motion sparingly.
8. Run geometry validation after each coherent checkpoint and inspect warnings by element name. Use [visual-qa.md](visual-qa.md) before making visual-quality claims.
9. Re-read the final document, validate once more, report the exact QA level, and export only when requested.

## Build an element-led narrative

Treat a slide as a checkpoint in one timeline:

```text
checkpoint 1: employee + document inside company
checkpoint 2: same document moves toward a personal AI tool
checkpoint 3: a trust boundary appears and the document crosses it
checkpoint 4: an approved harness enters; document returns inside
checkpoint 5: hook, policy, audit, and MCP accumulate around that harness
```

Keep stable identity for the employee, document, boundary, harness, and connectors. A title may persist and change content, but do not let title replacement become the only transition. Introduce at most one or two focal concepts per checkpoint. Keep the background stable across the sequence unless the story truly changes scene.

## Edit without losing concurrent work

1. Read the current presentation immediately before the change.
2. Form one semantic transaction and give it a unique key such as `pricing-slide-realign-v1`.
3. Send the current revision.
4. On conflict or an uncertain response, follow [recovery.md](recovery.md). Never increment a revision by assumption.

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
- Geometry validation cannot establish contrast, font rendering, crop quality, hierarchy, rhythm, or whether motion communicates the intended story.

## Batch command shape

Each operation in `apply_commands.commands` contains `command`, the relevant IDs, and an `arguments` object. The outer call supplies the transaction's `expected_revision` and `idempotency_key`; do not put stale revision values inside operations.

Prefer a smaller coherent batch over one giant deck-wide batch. A failed batch changes nothing, which makes recovery and user-facing explanations clearer.

For a large deck, scaffold blank checkpoints in batches of at most 100 operations, then compose by scene or narrative beat. Journal every outer idempotency key and revision; do not embed either in operations.
