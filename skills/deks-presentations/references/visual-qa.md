# Geometry and visual QA

## Name the QA level honestly

Report one of these levels:

1. **State inspection** — element properties and identities were read.
2. **Geometry validation** — `validate_layout` and optional `get_layout_snapshot` were reviewed.
3. **Rendered review** — renderer output was inspected slide by slide and as a sequence.
4. **Human presentation QA** — the user reviewed the actual deck/playback.

Never call levels 1 or 2 a polished visual review.

## Geometry validation

`validate_layout` reports outside-canvas geometry and pairwise AABB collisions. It does not understand z-order intent, parent/child containment, text over its background, progress fills, or decorative overlays. Text bounds from `get_layout_snapshot` are deterministic estimates unless the response explicitly identifies a renderer measurement.

Treat objective errors and outside-canvas elements as blockers unless a deliberate crop is documented. Review collision warnings by semantic element name and coordinates. Summarize intentional classes rather than listing hundreds of equivalent containment warnings.

## Rendered review

Use `render_slide_preview` with the current presentation revision for every checkpoint. A stale-revision failure means the deck changed: re-read before rendering again. Inspect checkpoints individually and then as an ordered sequence. Check:

- hierarchy, contrast, alignment, rhythm, and typography;
- clipping, wrapping, assets, gradients, and link-button states;
- continuity of persistent elements and focal attention;
- transition timing and reduced-motion behavior;
- whether the background and visual direction remain coherent.

If no renderer preview exists, say so and ask for human visual QA. Do not infer polish from zero geometry errors.

For contrast, prefer a full result from `recommend_palettes` and honor its semantic roles and paired foreground colors. Re-render after any palette change. Decorative accents that pass against the background may still fail when used as text or inside another surface, so evaluate the actual rendered pairing.
