# Motion as narrative

## The model in one paragraph

Every element plays exactly one of three roles at a boundary: `in` when it is only
on the second slide, `out` when it is only on the first, and `morph` when it is on
both. Each role carries an `animation`, a `duration_beats`, a `delay_ms` and an
`easing`. The presentation declares all three roles in full; a slide and an element
state declare only what they change, property by property. Write the exception where
it belongs and let everything else inherit.

## Establish the base rhythm

Set one `motion_beat_ms` for the presentation and express every duration as a
multiple of it:

- `1` beat: normal checkpoint work;
- `0.5` or `0.75`: supporting changes and quick acknowledgements;
- `1.5` or `2`: deliberately weighty transformations.

Avoid arbitrary milliseconds for duration. `delay_ms` is the exception and it is
real milliseconds: use it sparingly, to let one element land after another, never
to build an implicit choreography of many elements.

## Let the presentation carry the flow

Set the presentation-level motion first, with `set_motion` and no `slide_id`. That
declaration must be complete; it is the only one that is. Most elements should never
need anything else.

Use `fade` or `none` as the normal presence for titles, body text, labels, citations
and supporting copy. Text may enter, exit or remain; do not make it travel merely
because the composition changes between checkpoints.

Before authoring motion, write a section contract with:

- the identities that persist through the section;
- their anchored position and scale;
- the local elements that may enter or exit;
- the section-boundary transformation that can justify re-anchoring.

Do not animate responsive re-layout. If a continuing object moves a few pixels only
to balance the next static composition, keep it on its section anchor and arrange
the local content around it.

For every edge, name one central motion in a short causal phrase such as `the route
branches`, `the barrier blocks the approved path`, or `the pilot perimeter encloses
the route`. By default animate only one or two focal story elements. A tightly
coupled group may move together when it reads as that same action; unrelated
interpolation is jitter and must be removed.

## The animations, and what each one is for

| Animation | Shape | Use it when |
|---|---|---|
| `{kind: "fade"}` | opacity only | an idea is restated, revealed, or changes emphasis without implied movement |
| `{kind: "slide", edge, distance?}` | travels from or towards an edge | an object is displaced, transferred, or arrives from a meaningful direction |
| `{kind: "scale", from}` | starts smaller or larger, in place | something is presented, magnified or lands as an object rather than as text |
| `{kind: "none"}` | instantaneous | the change is meant to be a cut |
| `{kind: "morph"}` (role `morph`) | interpolates both states | the element continues and its geometry or style carries the change |
| `{kind: "cut"}` (role `morph`) | snaps between states | a continuing element must not draw attention while something else moves |

Two parameters are worth knowing:

- **`distance`** on a slide. Without it the element travels until it is completely
  off the canvas, which is the right default for something that leaves the story.
  With it the element travels exactly that many canvas units: a short 40 to 120 unit
  slide reads as a nudge, an arrival in place, not an entrance from outside.
- **`from`** on a scale. `0.8` to `0.95` reads as the object settling; below `0.5`
  it reads as a zoom and competes with the content.

`easing` accepts the four named curves or four cubic-bezier controls
`[x1, y1, x2, y2]`. Prefer `ease-out` for entrances, `ease-in` for exits and
`ease-in-out` for morphs; reach for a bezier only when a specific overshoot or
deceleration is part of the story.

## Where to write each value

- **Presentation**: the deck's rhythm and its default behavior for the three roles.
- **Slide**: how this checkpoint is arrived at or left, when the whole slide differs.
  A section opener that arrives from the right, a conclusion that lingers longer.
- **Element state**: one element whose semantic role differs from the flow, or a
  short delay that makes it land after the element it depends on.

Clearing is first-class: `clear_motion` on a slide or an element removes the patch
and the role inherits again. Prefer clearing over restating an inherited value,
because a restated value stops following the deck when the deck changes.

## Audit playback behavior

For every adjacent checkpoint edge:

1. List persistent, entering and exiting element identities.
2. State the single central motion and the identities allowed to move for it.
3. Compare persistent geometry with the active section contract; flag every
   unexplained delta, even a small one.
4. Resolve each identity's role and read the value it actually inherits: document,
   then slide, then element state, property by property.
5. Predict which motion comes from morph interpolation, from the slide, and from an
   element patch.
6. Play or otherwise inspect the real transition at normal speed.
7. Confirm the visible result matches the prediction and narrative direction and that
   no secondary drift competes for attention.
8. If an element merely appears despite a non-`none` inherited animation, treat it as
   a renderer or contract defect. Capture the smallest reproducible edge and fix the
   implementation before compensating with per-element patches.

Respect reduced-motion behavior and ensure the story remains understandable without
animation.
