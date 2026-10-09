# Explicit OpenAI tool map

This reference describes the candidate source contract. Use the actual discovered
schemas before calling; local documentation does not prove deployment or availability.
The configured endpoint is `https://api-deks.eigen.cl/mcp/openai/`. It uses OAuth.
There is no generic command dispatcher. Never switch channels to bypass a missing tool.

Read current presentation state before planning writes. Each mutation is a separate
transaction with its own revision and idempotency key where declared by the input.
Only the human-operated confirmation card may invoke the private deletion executor.

## State and continuity

`create_element` declares a new identity and its first state. Continue an existing
object with `add_existing_element_state`; use `update_element_state` for local changes.
Geometry x/y/width/height is required; omitted opacity/z_index/rotation_deg uses
1/0/0 and omitted anchor clears it. Optional subtype fields remain unchanged.
Read existing state to preserve common fields and anchor. Shared identity changes affect
every slide carrying that identity. A new authored phrase across slides needs a new
text identity; an explicit correction updates the existing identity globally.
Logical groups preserve absolute geometry. Numeric values and formatting use the
declared numeric inputs; do not replace a continuing number identity with text.

## Review and media boundaries

Resolve one exact named presentation for permanent deletion and read it immediately
before preparation. Alternatives or delegated target choices need clarification
with zero DEKS tool calls. Preparation leaves data intact; only the v5 card and one
human click may execute deletion. Never request, expose or reconstruct its hidden token.
Image upload accepts a host-provided attachment, not arbitrary URLs, local paths or
narration audio. New audio admission, .deks import and PowerPoint export are outside
this OpenAI surface. A public share shows current content, so edits change it live.

## Tools

### `list_icon_catalog`

List trusted offline icon vectors by semantic tag.

Lucide is the first registered family. Results contain sanitized SVG
primitive nodes and no remote URL, so a renderer can resolve icons
without a runtime network dependency.

Required inputs: none.
Declared inputs: `family`, `query`, `limit`, `cursor`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `recommend_palettes`

Recommend deterministic semantic palettes with measured contrast.

Apply the returned six role colors as a complete palette; contrast
checks cover text, subtext and primary accents against the background.

Required inputs: `intent`.
Declared inputs: `intent`, `mode`, `limit`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `complete_palette`

Complete six cohesive palette roles from optional preserved anchors.

The result is deterministic, contains measured contrast checks and
recommends configurable success/failure/warning colors. No remote
resources or URLs are returned. Pass the six returned roles to
set_presentation_palette after reviewing them.

Required inputs: none.
Declared inputs: `intent`, `mode`, `background`, `primary`, `secondary`, `reserve_semantic_colors`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `list_presentations`

List presentations in the authorized workspace, including names, IDs and current revisions.

Use the returned id to read the complete document with get_presentation.
This does not search other workspaces or public presentations.

Required inputs: none.
Declared inputs: none.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `list_assets`

List reusable workspace images in stable newest-first pages.

Use the returned next_cursor verbatim for the following page. Results
are scoped to the workspace authorized by the token. Internal storage
hashes and workspace-authenticated URLs are not exposed.

Required inputs: none.
Declared inputs: `limit`, `cursor`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `upload_asset`

Download one ChatGPT-attached image and save it in the authorized DEKS workspace.

Use this only when ChatGPT supplied the top-level file attachment. It
creates a reusable workspace asset but does not place it on any slide;
use the returned asset id in later image-element mutations. Keep the
idempotency_key stable only when retrying this exact ChatGPT file.
Downloads only from the host-supplied attachment URL under the secure downloader
policy, then validates image bytes, size and workspace quota before saving.
Local paths, base64 payloads and user-provided URL strings are not inputs.

Required inputs: `file`, `idempotency_key`.
Declared inputs: `file`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### `create_presentation`

Create a presentation with one blank slide in the token's workspace.

Use expected_revision=0. Keep the idempotency_key stable when retrying the
same request after a timeout; the replay returns the original presentation.

Required inputs: `name`, `motion_beat_ms`, `expected_revision`, `idempotency_key`.
Declared inputs: `name`, `motion_beat_ms`, `expected_revision`, `idempotency_key`, `canvas`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `set_presentation_palette`

Replace the complete default palette as one reversible transaction.

Prefer complete_palette first. All six #RRGGBB roles are required and
must meet the measured background contrast contract.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `primary`, `secondary`, `accent`, `background`, `text`, `subtext`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `primary`, `secondary`, `accent`, `background`, `text`, `subtext`, `expected_revision`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `prepare_presentation_deletion`

Prepare a human confirmation card for permanent presentation deletion.

Call only when the user's most recent message selects one exact presentation by
its exact name. If it offers alternatives, comparisons, tie-breaks, or delegates
which presentation to choose, do not inspect DEKS and ask a clarifying question.
This model-visible tool never deletes data. It validates one exact tenant-scoped
presentation id, current revision and name, then gives a short-lived capability
only to the private confirmation component. The model cannot invoke the final
deletion tool or receive its capability token.

Required inputs: `presentation_id`, `expected_revision`, `confirmation_name`.
Declared inputs: `presentation_id`, `expected_revision`, `confirmation_name`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `confirm_delete_presentation`

Permanently delete the exact presentation approved in the human confirmation card.

App-only: accept the private, short-lived confirmation capability issued by
prepare_presentation_deletion. Verify actor, workspace, name and revision
again; stale, expired, tampered or reused capabilities fail safely. Removes
the presentation, complete history and any public access; cannot be undone.
Never invoke from a model-authored call.

Required inputs: `confirmation_token`.
Declared inputs: `confirmation_token`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: false`.

App-only/private. The model must never call this tool; only the human confirmation card may call it.

### `get_presentation`

Read the complete private presentation document by its ID.

Includes ordered slides, element identities, slide-local states, palette,
motion, narration and current revision. Read before editing; use the
returned revision as expected_revision for the next write.

Required inputs: `presentation_id`.
Declared inputs: `presentation_id`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `render_slide_preview`

Render one private slide as a PNG for visual QA.

The preview is sent to the MCP client/model like any other read result. Pass
the current presentation revision so a concurrent edit cannot yield stale QA.

Required inputs: `presentation_id`, `slide_id`, `expected_revision`.
Declared inputs: `presentation_id`, `slide_id`, `expected_revision`, `width`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `get_presentation_publication`

Read whether a presentation currently has a non-enumerable public link.

Required inputs: `presentation_id`.
Declared inputs: `presentation_id`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `publish_presentation`

Enable public access to the presentation and return its public playback URL.

Anyone with the URL can read the live document and its referenced assets.
Later edits are visible through the same link; publication is not a snapshot.
Only publish when the user requested sharing. Retry the same request with
the same idempotency_key; unpublish_presentation revokes access.

Required inputs: `presentation_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `expected_revision`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### `rotate_presentation_publication`

Revoke the existing public playback URL and create a replacement URL.

Old links immediately stop working. The replacement exposes the same live
presentation to anyone with the new URL. Requires an existing publication.

Required inputs: `presentation_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `expected_revision`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `unpublish_presentation`

Revoke the public playback URL and access to its referenced assets.

The private presentation and history are retained. Existing public links
immediately stop working; publish_presentation can issue a new link later.

Required inputs: `presentation_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `expected_revision`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `get_layout_snapshot`

Read a slide layout for inspecting geometry, layering and content.

Returns the complete presentation document and the selected slideId, not
a rendered image or measured bounding boxes. Same data as get_slide_state;
use that editing-oriented alias before replacing an element state. Use
validate_layout for geometry checks and render_slide_preview for visual QA.

Required inputs: `presentation_id`, `slide_id`.
Declared inputs: `presentation_id`, `slide_id`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `get_slide_state`

Read slide-local element states before creating or replacing slide content.

Returns the complete presentation document and selected slideId. Preserve
every required state property when calling update_element_state. This is
an editing-oriented alias of get_layout_snapshot; it returns the same data.

Required inputs: `presentation_id`, `slide_id`.
Declared inputs: `presentation_id`, `slide_id`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `validate_layout`

Check the complete presentation for invalid layout and geometry warnings.

Returns structured diagnostics without changing the document. Does not
render pixels; use render_slide_preview to inspect the visual result.

Required inputs: `presentation_id`.
Declared inputs: `presentation_id`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

### `duplicate_slide`

Copy one slide and insert the copy immediately after it.

Preserves the shared element identities while copying slide-local visual
states and design. The returned slide IDs identify the new slide.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `slide_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `slide_id`, `expected_revision`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### `create_slide`

Insert a slide after after_slide_id, or after the last slide when omitted.

Copies the preceding slide by default; copy_from_slide_id explicitly selects
the source. Reuses element identities with independent slide-local states.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `expected_revision`, `idempotency_key`, `after_slide_id`, `copy_from_slide_id`, `slide_id`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### `reorder_slides`

Replace the ordered list of slides with all current slide IDs exactly once.

Does not create or delete slides; invalid, duplicate or missing IDs are refused.
The reorder is one reversible presentation transaction.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `slide_ids`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `slide_ids`, `expected_revision`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `delete_slide`

Remove one slide and its element states, retaining the order of remaining slides.

Cannot remove the last slide. An element identity with no remaining states
is also removed when it has no children. This is a reversible transaction.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `slide_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `slide_id`, `expected_revision`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `update_slide`

Change one slide name, template flag or background, preserving other slides.

Omitted fields remain unchanged. Use set_motion for animation changes.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `slide_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `slide_id`, `expected_revision`, `idempotency_key`, `name`, `is_template`, `background`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `set_slide_narration`

Replace one slide narration script, pauses and optional existing audio reference.

This does not generate or download audio. audio may reference only an admitted
workspace asset. Omitting audio removes its prior narration audio reference.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `slide_id`, `script`, `pause_before_ms`, `pause_after_ms`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `slide_id`, `script`, `pause_before_ms`, `pause_after_ms`, `expected_revision`, `idempotency_key`, `audio`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `clear_slide_narration`

Remove one slide's complete portable narration object.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `slide_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `slide_id`, `expected_revision`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `create_element`

Create one named element identity and place its initial state on a slide.

kind selects the visual data type, not another operation: text requires
content, shape requires shape_kind, image requires an uploaded asset_id,
link-button requires label and HTTPS url, and icon requires catalog family
and name. number accepts value, decimals, separators, symbol and an optional
animate_magnitude setting. x/y/width/height use presentation canvas coordinates.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `slide_id`, `kind`, `name`, `x`, `y`, `width`, `height`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `slide_id`, `kind`, `name`, `x`, `y`, `width`, `height`, `expected_revision`, `idempotency_key`, `content`, `shape_kind`, `font_family`, `font_size`, `asset_id`, `alt`, `fill`, `stroke`, `shape_fill`, `stroke_width`, `corner_radius`, `corner_radii`, `opacity`, `z_index`, `rotation_deg`, `font_weight`, `line_height`, `letter_spacing`, `horizontal_alignment`, `vertical_alignment`, `overflow_mode`, `fit`, `semantic_role`, `element_id`, `parent_id`, `animate_magnitude`, `anchor`, `label`, `url`, `text_color`, `icon_family`, `icon_name`, `padding`, `value`, `decimals`, `group_separator`, `decimal_separator`, `symbol`, `symbol_position`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### `update_element_state`

Update one element state on one slide, preserving its states on other slides.

x/y/width/height are required. Omitted opacity, z_index and rotation_deg use
1, 0 and 0; omitted anchor clears the anchor. Omitted optional subtype properties
(font, fill, numeric value/formatting, image asset and padding) remain unchanged.
Read get_slide_state first to preserve any required common geometry or anchor.
Text identity changes use update_element_identity; motion uses set_motion.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `slide_id`, `element_id`, `x`, `y`, `width`, `height`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `slide_id`, `element_id`, `x`, `y`, `width`, `height`, `expected_revision`, `idempotency_key`, `font_family`, `font_size`, `asset_id`, `alt`, `fill`, `stroke`, `shape_fill`, `stroke_width`, `corner_radius`, `corner_radii`, `opacity`, `z_index`, `rotation_deg`, `font_weight`, `line_height`, `letter_spacing`, `horizontal_alignment`, `vertical_alignment`, `overflow_mode`, `fit`, `anchor`, `label`, `url`, `text_color`, `icon_family`, `icon_name`, `padding`, `value`, `decimals`, `group_separator`, `decimal_separator`, `symbol`, `symbol_position`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `remove_element_from_slide`

Remove one element state from one slide, preserving its states on other slides.

If this was the last state and the identity has no children, its unused
identity is also removed. The transaction can be undone.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `slide_id`, `element_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `slide_id`, `element_id`, `expected_revision`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `add_existing_element_state`

Place an existing element on a target slide by copying its source slide state.

Reuses the element identity; optional x/y override the copied position.
Does not create a new identity or change the source state.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `target_slide_id`, `source_slide_id`, `element_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `target_slide_id`, `source_slide_id`, `element_id`, `expected_revision`, `idempotency_key`, `x`, `y`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### `delete_element`

Remove one element identity and all of its states across the presentation.

A group with children is refused; detach its children with
update_element_identity first. This deletion is a reversible transaction.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `element_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `element_id`, `expected_revision`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `update_element_identity`

Update one identity shared by every checkpoint; text fields require a text element.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `element_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `element_id`, `expected_revision`, `idempotency_key`, `name`, `content`, `font_family`, `horizontal_alignment`, `vertical_alignment`, `overflow_mode`, `parent_id`, `clear_parent`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `set_presentation_motion_beat`

Set the global motion beat in milliseconds; ratio-based durations follow it.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `motion_beat_ms`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `motion_beat_ms`, `expected_revision`, `idempotency_key`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `set_motion`

Set how elements enter, leave or morph, for the deck, a slide or one element.

Omit slide_id to declare the presentation default, which must be complete.
A slide or element declares only what it changes; everything else is inherited.

The two delays add. `delay_beats` is a multiple of the deck's beat, so
"start when the previous animation ends" survives a change of tempo;
`delay_ms` is absolute, for an offset about a specific instant.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `role`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `role`, `expected_revision`, `idempotency_key`, `slide_id`, `element_id`, `animation`, `duration_beats`, `delay_beats`, `delay_ms`, `easing`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `clear_motion`

Drop a slide or element motion patch so the role inherits again.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `role`, `slide_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `role`, `slide_id`, `expected_revision`, `idempotency_key`, `element_id`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `undo_transaction`

Restore the state before one reversible presentation transaction.

Omit transaction_id to undo the newest eligible transaction, or select its
exact ID. Cannot undo permanent presentation deletion or public-link changes.

If this presentation is published, the change is immediately visible through its existing public link. This tool does not create a publication.

Required inputs: `presentation_id`, `expected_revision`, `idempotency_key`.
Declared inputs: `presentation_id`, `expected_revision`, `idempotency_key`, `transaction_id`.
Safety annotations: `readOnlyHint: false`, `openWorldHint: true`, `destructiveHint: true`, `idempotentHint: true`.

### `export_deck`

Read and export the private presentation as a portable .deks archive.

Returns filename, media_type, base64 bytes and revision. Includes admitted
embedded assets; does not publish a URL or modify the presentation.

Required inputs: `presentation_id`.
Declared inputs: `presentation_id`.
Safety annotations: `readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`, `idempotentHint: true`.

