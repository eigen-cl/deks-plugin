# DEKS MCP tool map

Remote endpoint: `https://api-deks.eigen.cl/mcp/`

Public clients authenticate through the server's MCP OAuth flow. A direct development/CLI connection may instead send `Authorization: Bearer deks_pat_...`; PATs are workspace-bound, shown once, hashed at rest, revocable, and scoped to `read` and/or `write`. Never embed a PAT in a distributed plugin.

Treat the tools discovered from the server as the current source of truth. Review
their schemas plus `readOnlyHint`, `openWorldHint`, and `destructiveHint`
annotations before every release; do not rely on a hard-coded tool count.

## Read tools

- `list_presentations()` — list workspace decks and canonical revisions.
- `get_presentation(presentation_id)` — read the presentation, ordered slides, transitions, element states, and current revision.
- `get_slide_state(presentation_id, slide_id)` — read one checkpoint and its typed states.
- `get_layout_snapshot(presentation_id, slide_id)` — read absolute rectangles; rendered text bounds are estimates unless marked otherwise.
- `validate_layout(presentation_id)` — return objective errors and non-blocking geometry warnings.
- `export_deck(presentation_id)` — return a portable `.deks` ZIP archive as base64.

## Slide tools

- `create_presentation(name, motion_beat_ms, expected_revision, idempotency_key, canvas_width?, canvas_height?)` — create a presentation with one blank slide. Use `expected_revision: 0` when this tool is present in the discovered server contract.
- `delete_presentation(presentation_id, expected_revision, confirmation_name)` — permanently delete the complete presentation history when this tool is present. It is intentionally non-idempotent and requires an explicit user deletion request, a fresh read, the exact revision, and exact presentation name.
- `create_slide(presentation_id, expected_revision, idempotency_key, after_slide_id?, copy_from_slide_id?, slide_id?)`
- `duplicate_slide(presentation_id, slide_id, expected_revision, idempotency_key)`
- `update_slide(presentation_id, slide_id, expected_revision, idempotency_key, name?, in_preset?, in_duration_multiplier?, out_preset?, out_duration_multiplier?)`
- `reorder_slides(presentation_id, slide_ids, expected_revision, idempotency_key)`
- `delete_slide(presentation_id, slide_id, expected_revision, idempotency_key)`

`reorder_slides` requires the complete ordered list. `create_slide` copies the preceding checkpoint by default.

## Element tools

- `create_element(...)` — create a stable identity and its state on one slide. Required geometry is `x`, `y`, `width`, and `height`; `kind` is `text`, `image`, `shape`, or `group`.
- `update_element_state(...)` — replace one slide-local state without changing other checkpoints.
- `add_existing_element_state(presentation_id, target_slide_id, source_slide_id, element_id, expected_revision, idempotency_key, x?, y?)` — continue a stable identity onto another slide.
- `remove_element_from_slide(...)` — remove only one checkpoint state.
- `rename_element(...)` — rename an identity across every slide.
- `delete_element(...)` — delete the identity and every checkpoint state.

Images require an existing `asset_id`. Shapes require `shape_kind`: `rectangle`, `ellipse`, or `line`. `shape_fill` accepts either:

```json
{"kind":"solid","solid_color":"#FF7043"}
```

or:

```json
{"kind":"linear-gradient","gradient_start":"#FF7043","gradient_end":"#0B0C0E","angle_deg":135}
```

## Motion and history tools

- `set_presentation_motion_beat(presentation_id, motion_beat_ms, expected_revision, idempotency_key)`
- `set_transition(presentation_id, from_slide_id, to_slide_id, duration_multiplier, delay_ms, easing_kind, expected_revision, idempotency_key, bezier_x1?, bezier_y1?, bezier_x2?, bezier_y2?)`
- `set_transition_override(presentation_id, from_slide_id, to_slide_id, element_id, animate, expected_revision, idempotency_key, duration_multiplier?, delay_ms?)`
- `set_element_transition_motion(presentation_id, from_slide_id, to_slide_id, element_id, direction, preset, duration_multiplier, delay_ms, expected_revision, idempotency_key)`
- `apply_commands(presentation_id, commands, expected_revision, idempotency_key)` — apply 1–100 typed operations atomically as one revision and undo step.
- `undo_transaction(presentation_id, expected_revision, idempotency_key, transaction_id?)`

Transition easing kinds are `linear`, `ease-in`, `ease-out`, `ease-in-out`, and `cubic-bezier`. Cubic Bézier easing requires all four control points, with x values between 0 and 1.

## Current capability boundaries

At package release time, verify capability boundaries against the MCP discovery
result. This skill currently assumes that asset upload, `.deks` import, and PPTX
export are web-app workflows. Use `export_deck` for portable `.deks` output when
the discovered server exposes it.
