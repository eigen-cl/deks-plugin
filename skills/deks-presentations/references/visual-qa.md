# Geometry and visual QA

## Name the QA level honestly

Report one of these levels:

1. **State inspection** — element properties and identities were read.
2. **Geometry validation** — `validate_layout` and optional `get_layout_snapshot` were reviewed.
3. **Rendered review** — renderer output was inspected slide by slide and as a sequence.
4. **Human presentation QA** — the user reviewed the actual deck/playback.

Never call levels 1 or 2 a polished visual review.

## Geometry validation

`validate_layout` reports outside-canvas geometry and pairwise AABB collisions. It does not understand z-order intent, parent/child containment, text over its background, progress fills, or decorative overlays. Text bounds from `get_layout_snapshot` are deterministic estimates, not browser measurements. Do not use them to claim that text fits or wraps as intended.

Treat objective errors and outside-canvas elements as blockers unless a deliberate crop is documented. Review collision warnings by semantic element name and coordinates. Summarize intentional classes rather than listing hundreds of equivalent containment warnings.

## Rendered review

Use `render_slide_preview` with the current presentation revision for every checkpoint. A stale-revision failure means the deck changed: re-read before rendering again. For each result:

1. Require `layout_measurements_available` to be exactly `true`. Treat `false` or an absent field as a valid image preview without DOM diagnostics, never as evidence that nothing overflows.
2. From the freshly read slide state, derive the expected rendered element ID set. Compare it with `layout_measurements[*].element_id`; require exact set equality and reject missing, duplicate, or unexpected IDs as incomplete coverage.
3. Only after availability and exact coverage are established, inspect `overflow_element_ids`, map each ID to its semantic element name and state, and treat every unintended overflow as a blocker. An empty list before those gates is not negative evidence.
4. Check actual line wrapping in both the measurements and PNG. A text box may fit without clipping yet wrap into a visually harmful extra line.
5. Correct content, typography, or geometry with the latest revision; then re-read and re-render the affected checkpoint. Do not report the defect as fixed from a write response or geometry validation alone.
6. Confirm the corrected preview reports availability `true`, exact element coverage, and no affected overflow IDs; then inspect the new PNG before delivery.

If DOM diagnostics are unavailable or incomplete, report that status and the coverage discrepancy instead of substituting `get_layout_snapshot` estimates. The PNG can still support a rendered visual observation such as “no visible clipping was noticed,” but never a DOM-verified no-overflow conclusion. Inspect checkpoints individually and then as an ordered sequence. Check:

- hierarchy, contrast, alignment, rhythm, and typography;
- clipping, wrapping, assets, gradients, and link-button states;
- continuity of persistent elements and focal attention;
- transition timing and reduced-motion behavior;
- whether the background and visual direction remain coherent.

If no renderer preview exists, say so and ask for human visual QA. Do not infer polish from zero geometry errors.

For contrast, prefer a full result from `recommend_palettes` and honor its semantic roles and paired foreground colors. Re-render after any palette change. Decorative accents that pass against the background may still fail when used as text or inside another surface, so evaluate the actual rendered pairing.
