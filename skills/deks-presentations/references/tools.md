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
- `get_layout_snapshot(presentation_id, slide_id)` — read absolute rectangles and deterministic geometry estimates. Treat estimated text bounds as conservative pre-render signals, never as browser measurements.
- `render_slide_preview(presentation_id, slide_id, expected_revision, width?)` — render one private checkpoint as a PNG (`width` is `1280` or `1600`) and return `layout_measurements_available`, renderer-derived `layout_measurements`, and `overflow_element_ids`. Always pass the freshly read revision. Use DOM measurements only when the availability flag is exactly `true` and their unique element ID set equals the freshly read slide's rendered element ID set. Missing, duplicate, or unexpected measurement IDs make coverage incomplete. Only complete coverage plus an empty overflow list supports a no-overflow conclusion. A false or absent flag is an image preview without DOM diagnostics, even if `layout_measurements` or `overflow_element_ids` is empty. Map reported overflow IDs back to semantic element names, correct them, re-read, and re-render until a compatible result confirms exact coverage and no overflow. The image is sent to the MCP client/model and is the basis for rendered QA, not a data-isolation mechanism.
- `validate_layout(presentation_id)` — return geometry-only errors and AABB collision/outside-canvas warnings based on authored bounds and estimates. It is not DOM measurement or rendered visual QA and currently has no semantic understanding of containment or z-order intent.
- `list_icon_catalog(family?, query?)` — discover trusted offline vector icons by semantic tags. `lucide` is the first family; results contain local path geometry, never remote URLs.
- `recommend_palettes(intent, mode?, limit?)` — recommend complete semantic palettes with measured contrast ratios. Apply role colors and their paired `on_colors` together rather than cherry-picking swatches.
- `export_deck(presentation_id)` — return a portable `.deks` ZIP archive as base64. The server normally caps the final archive and total assets at 20 MB; never paste the base64 into chat.

## Slide tools

- `create_presentation(name, motion_beat_ms, expected_revision, idempotency_key, canvas_width?, canvas_height?)` — create a presentation with one blank slide. Use `expected_revision: 0` when this tool is present in the discovered server contract.
- `delete_presentation(presentation_id, expected_revision, confirmation_name)` — permanently delete the complete presentation history when this tool is present. It is intentionally non-idempotent and requires an explicit user deletion request, a fresh read, the exact revision, and exact presentation name.
- `create_slide(presentation_id, expected_revision, idempotency_key, after_slide_id?, copy_from_slide_id?, slide_id?)`
- `duplicate_slide(presentation_id, slide_id, expected_revision, idempotency_key)`
- `update_slide(presentation_id, slide_id, expected_revision, idempotency_key, name?, background?, is_template?, in_preset?, in_duration_multiplier?, out_preset?, out_duration_multiplier?)`
- `reorder_slides(presentation_id, slide_ids, expected_revision, idempotency_key)`
- `delete_slide(presentation_id, slide_id, expected_revision, idempotency_key)`

`reorder_slides` requires the complete ordered list. `create_slide` copies the preceding checkpoint by default, including all element states. To scaffold a new deck safely, create every checkpoint while its predecessor is still blank, or pass an explicitly blank `copy_from_slide_id`; compose afterward. The MCP `create_presentation` input does not accept a palette, so use explicit slide/element colors.

## Element tools

- `create_element(...)` — create a stable identity and its state on one slide. Required geometry is `x`, `y`, `width`, and `height`; `kind` is `text`, `image`, `shape`, `group`, `link-button`, or `icon`.
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

Lines use `stroke_color`, not a gradient fill. A `link-button` requires a label and a safe absolute HTTPS URL. The current MCP does not expose group parent/child editing.

An `icon` requires a catalog-backed `icon_family` and `icon_name`; use its normal element `color` for the glyph. Query the catalog by meaning first, keep the icon offline, and never paste arbitrary SVG or fetch an icon URL at render time. Treat icon identity changes as discrete between checkpoints; position, scale, rotation, opacity, and color may still animate through the stable element identity.

## Motion and history tools

- `set_presentation_motion_beat(presentation_id, motion_beat_ms, expected_revision, idempotency_key)`
- `set_transition(presentation_id, from_slide_id, to_slide_id, duration_multiplier, delay_ms, easing_kind, expected_revision, idempotency_key, bezier_x1?, bezier_y1?, bezier_x2?, bezier_y2?)`
- `set_transition_override(presentation_id, from_slide_id, to_slide_id, element_id, animate, expected_revision, idempotency_key, duration_multiplier?, delay_ms?)`
- `set_element_transition_motion(presentation_id, from_slide_id, to_slide_id, element_id, direction, preset, duration_multiplier, delay_ms, expected_revision, idempotency_key)`
- `apply_commands(presentation_id, commands, expected_revision, idempotency_key)` — apply 1–100 typed operations atomically as one revision and undo step. `update_slide` and `set_presentation_motion_beat` are not batch commands.
- `undo_transaction(presentation_id, expected_revision, idempotency_key, transaction_id?)`

Transition easing kinds are `linear`, `ease-in`, `ease-out`, `ease-in-out`, and `cubic-bezier`. Cubic Bézier easing requires all four control points, with x values between 0 and 1.

## Exact batch envelope

Each operation is strict:

```json
{
  "command": "create_element",
  "arguments": {
    "slide_id": "target-slide-id",
    "kind": "text",
    "name": "Hero title",
    "content": "A claim",
    "x": 100,
    "y": 80,
    "width": 900,
    "height": 100
  }
}
```

- Put `slide_id` inside `arguments` for `create_element`.
- Put `slide_id` and `element_id` beside `command` for `update_element_state`, `remove_element_from_slide`, and `add_existing_element_state`; the latter puts `source_slide_id` in `arguments`.
- Put `from_slide_id`, `to_slide_id`, and when needed `element_id` beside `command` for transitions.
- Put `expected_revision` and `idempotency_key` only on the outer `apply_commands` call.
- A failed batch rolls back every operation. A timeout or transport error is an uncertain result; re-read before retrying.

## Current capability boundaries

At package release time, verify capability boundaries against the MCP discovery result. A compatible server exposes rendered slide previews with `layout_measurements_available`, DOM `layout_measurements`, and `overflow_element_ids`, plus offline icon discovery and palette recommendations. Do not silently fall back to geometric estimates if any preview diagnostic field is unavailable or coverage is incomplete; report the reduced QA level. Asset upload, `.deks` import, PPTX export, native speaker notes, and source metadata remain web-app or future-server workflows. Use visible text for source notes and `export_deck` for portable `.deks` output when the discovered server exposes it.
