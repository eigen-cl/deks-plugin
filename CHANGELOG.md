# Changelog

All notable changes to the DEKS plugin are documented in this file. Versions
follow Semantic Versioning.

## 0.4.1 — 2026-09-01

### Changed

- Replace direct presentation deletion with a two-step human confirmation flow.
  `delete_presentation` now prepares an inline confirmation card without deleting;
  only the app-only `confirm_delete_presentation` tool can consume the hidden,
  signed token and permanently remove the exact presentation.
- Keep ambiguous deletion requests fail-closed: the model must not inspect the
  workspace or choose between alternative destructive targets for the user.
- Restore a deterministic positive deletion review case that proves preparation
  is non-destructive and one human click produces the authoritative deletion
  result, while preserving the complete versioned 0.4.0 submission as immutable
  evidence.

### Fixed

- Keep the human-confirmation capability bound while ChatGPT refreshes unrelated
  widget globals, and move the confirmation resource to v4 so clients cannot
  reuse the cached v3 component.

## 0.4.0 — 2026-08-31

### Changed

- Document the canonical codec v3 and its sequential v1 → v2 → v3 migration. Legacy
  text conflicts resolve deterministically from the first state in slide order;
  future codec versions remain explicit failures.
- Move fixed text fields (`content`, font family, alignments and overflow mode)
  to element identity, keep continuous typography and four-sided padding on the
  slide state, and make that ownership explicit in Cloud/Desktop commands.
- Require different identities for different copy or semantic text types, and
  use `x`/`y` or padding—not alignment changes—for fine visual positioning.
- Add portable per-slide narration with script, pauses and one embedded WAV/MP3
  rendition; document the Desktop `set-slide-narration` and
  `clear-slide-narration` commands and audio admission through `add_asset`.
- Bring the Cloud MCP to the canonical Core 6 codec v3 surface without
  version-suffixed tools. `get_presentation`, `get_slide_state`,
  `create_element`, `update_element_identity` and `list_icon_catalog` are the
  canonical contract.
- Add logical groups through `parent_id`/`clear_parent`, preserving absolute
  member geometry and group-aware collision diagnostics.
- Add `set_slide_narration` and `clear_slide_narration` for portable scripts,
  pauses and references to already admitted audio. `upload_asset` remains
  image-only and never admits narration audio.

### Fixed

- Replace ambiguous reviewer cases with five deterministic positive and three
  negative cases that name their fixtures and reset independently between
  ChatGPT web and mobile runs.

## 0.3.3 — 2026-08-25

### Added

- Teach Cloud agents to admit one explicitly attached image with `upload_asset`,
  reuse the returned asset ID across image states and preserve one image identity
  when the same logo continues between checkpoints.
- Add a positive reviewer case for an attached logo and a negative case that
  refuses to invent bytes, URLs or local-path access when no file is attached.

### Changed

- Update the OpenAI submission bundle and tool worksheet for the 35-tool Cloud
  MCP surface, including the private, non-destructive upload annotation.
- Regenerate the five uploadable skill archives and align the portal copy with
  the dedicated reviewer workflow.

## 0.3.2 — 2026-08-24

### Changed

- Make text identity explicit: unchanged copy may keep one identity, while a
  new phrase, claim, or label must use a new text element even when it occupies
  the same rectangle.
- Prefer bounded `apply_commands` transactions for a coherent checkpoint or
  short narration so remote clients avoid one round trip per element or
  property without weakening revision or idempotency safety.
- Validate and render coherent checkpoints after each batch instead of after
  every individual property mutation.

### Added

- Regression evals for changed-copy identity and low-latency batching, plus
  validator assertions that keep the operational guidance present across the
  shared, design, Cloud, and Desktop skills.

## 0.3.1 — 2026-08-23

### Changed

- Reposition the OpenAI listing around one collaborative presentation format
  shared by people and AI agents, with editable elements, persistent identities,
  and motion as part of the document.
- Add the required support URL, canonical trailing-slash public URLs, concise
  install-surface copy, and realistic starter prompts to the Codex manifest;
  align the Claude manifest and marketplace with the same product position.
- Prepare a copy-ready OpenAI portal sheet, initial-submission release notes,
  five positive and three negative reviewer cases, and a complete annotation
  worksheet for the 34 Cloud MCP tools.

### Added

- A dependency-free validator that keeps the OpenAI bundle, manifests, skills,
  icon, reviewer cases, URLs, and expected tool annotations synchronized.
- Push and pull-request CI for the bundle validator, whitespace checks, and the
  pinned official Claude plugin validator.

Publishing the package remains a separate reviewed portal action. A version bump,
Git tag, Git-backed marketplace, or Developer mode association does not publish
DEKS in either provider's official directory.

## 0.3.0 — 2026-08-23

### Changed

- `deks-desktop-mcp` now describes each presentation as one portable `.deks`
  file with embedded assets and atomic replacement, matching Desktop's
  file-first store instead of the retired expanded project folder.
- Image guidance now reflects the shared Web, Cloud and Desktop admission
  contract: PNG, JPEG, GIF and WebP up to 50 MB, plus canonical static SVG up to
  5 MB under a deliberately restricted, script-free profile.
- The skills distinguish the portable `.deks` bounds (95 MB physical and 90 MB
  uncompressed) from Cloud workspace quotas and the MCP's separate 20 MB export
  transport ceiling.

## 0.2.2 — 2026-08-22

### Changed

- Text motion now follows the narrative event: `fade` or `none` stays quiet when
  no direction is implied, `slide` carries meaningful lateral arrival or exit,
  and `crop` moves content inside its fixed mask while `wipe` uncovers content
  that remains still.
- Stagger timing is coordinated by visual bands using full vertical bounds and
  text baselines. Elements on the same row start together unless their content
  has an explicit sequential relationship.
- Removed the contradictory blanket advice that ordinary text must never travel
  and that every text entrance should avoid fade, while retaining the strict
  rule that replacement copy cannot enter until the outgoing text has cleared
  the shared zone.

## 0.2.1 — 2026-08-21

### Changed

- Text relay now follows an explicit two-beat handoff: the outgoing copy clears
  its space completely before replacement copy begins entering that same area.
- Motion examples use a delayed second beat instead of overlapping the exit and
  entrance of text that occupies the same region.

### Added

- Evaluation coverage for clean text replacement. The method also distinguishes
  changed copy from a native number element, whose stable identity can count and
  morph between checkpoints without being removed.

## 0.2.0 — 2026-08-20

### Added

- `deks-cloud-mcp` and `deks-desktop-mcp`: one skill per host. The two servers
  never had the same surface — Cloud takes `{"command", "arguments"}` in
  snake_case and exposes palettes, the icon catalogue, geometry validation,
  publication and export; Desktop takes DEKS Core commands with a kebab-case
  `type` and a camelCase payload, and has five tools. A single skill taught the
  Cloud map to every agent, so anyone on Desktop called tools that do not exist.
- `deks-motion-patterns`: a catalogue of reusable choreographies with the
  commands to build each one, including promoting a list item into the next
  slide's title, staggered entries and exits, text relay, a progress bar that
  fills, a counting figure, accumulation, replacement, a travelling protagonist,
  curtain and edge reveals, narrative zoom, focus by dimming, before/after, and
  the object that carries a whole section.
- `design-deks-presentations` now teaches how to *make* a presentation, not only
  how to audit one: abstracting a subject into topics, shaping each topic as a
  narration, and the two kinds of transition — advancing inside a narration, and
  moving from one narration to the next — which govern every motion decision.
  New reference `narrative.md`.
- `deks-presentations` gains `document-model.md` and `motion-contract.md`, and
  keeps `validation.md`: the document contract, host-independent.

### Changed

- `deks-presentations` is no longer the Cloud tool map. It is the contract of the
  document itself and routes to the host skill, to the method, and to the
  patterns. Its main page listed the animations as `none`, `fade`, `slide` and
  `scale` — omitting `crop` and `wipe` — and said delays were milliseconds, a
  version after both had changed.

### Fixed

- The Cloud tool map claimed the standalone `set_motion` tool accepts
  `delay_beats`. It did not; only the `set_motion` command inside
  `apply_commands` did, so staggered chains authored through the tool silently
  lost their musical delay. The server now exposes it on both paths and the map
  documents it.
- The Cloud `update_slide` signature carried `in_preset`, `out_preset` and the
  two `*_duration_multiplier` parameters from a retired motion API. Because the
  command model forbids unknown fields, sending any of them failed validation
  rather than being ignored. They are gone from the server and from the map.

## 0.1.11 — 2026-08-19

### Added

- The `wipe` animation: the element stays still and the mask edge travels over
  it, uncovering something already there rather than something arriving from
  behind a boundary. Documented beside `crop` with guidance on which to reach
  for.
- `delay_beats` alongside `delay_ms`. The two add. A follow-on written in beats
  survives a change of tempo; one written in milliseconds does not, and falls
  silently out of step.

## 0.1.10 — 2026-08-19

### Changed

- Prefer `crop`, a short `slide` or a `cut` over a fade when animating text. A
  fade reads as mush on letterforms, and when one line replaces another in the
  same position the two dissolve through each other until neither is readable.
  Fading out stays right for text that nothing replaces.

### Added

- The `number` element: a magnitude with complete declared formatting, and
  identity toggles saying which of the three roles count towards it.
- The `crop` presence animation, revealed inside the element's own rectangle.
- Guidance on when a figure should count and when it is an identifier that
  merely looks numeric.

## 0.1.9 — 2026-08-17

- Follow the inherited motion model of DEKS Core 2.0: three roles per element
  (`in`, `out`, `morph`), each with an animation, a duration in beats, a delay and
  an easing, declared complete on the presentation and patched by a slide or an
  element state.
- Replace the transition tools with `set_motion` and `clear_motion`, and document
  the parameterised animations, including how far a `slide` travels and where a
  `scale` starts.

## 0.1.8 — 2026-08-16

- Align the MCP tool guide with the canonical DEKS document and canvas contracts introduced by
  DEKS Core 1.0.
- Document the single canonical contract used by Core, Cloud and agent-driven presentation flows.

## 0.1.7 — 2026-08-15

- Prefer native DEKS vector elements for scalable animation and limit SVG guidance to trusted or
  sanitized assets supported by the complete editor, preview and export pipeline.
- State explicitly that DEKS Cloud does not accept arbitrary SVG uploads and add eval coverage that
  rejects unsafe SVG workarounds.

## 0.1.6 — 2026-08-15

- Correct the Claude distribution guide to target Anthropic's authenticated
  official marketplace submission flow.
- Record the completed public install and production OAuth/MCP smoke evidence
  while keeping reviewer-only credentials and reset fixtures out of Git.

## 0.1.5 — 2026-08-15

- Publish the plugin source under Apache-2.0 with complete EIGEN contact,
  repository, and license metadata.
- Keep the external DEKS MCP connection disabled until the user explicitly
  enables it.
- Add independent and official marketplace installation guidance plus the
  Claude review dossier.

## 0.1.4 — 2026-08-15

- Plan presentation motion section by section before composing checkpoints.
- Keep section-level story identities on stable anchors and re-anchor only at
  deliberate scene boundaries or when the story action requires movement.
- Give every slide edge one central motion while ordinary text enters, exits,
  or remains without unexplained spatial drift.
- Extend eval coverage for section continuity and distracting UI-element drift.

## 0.1.3 — 2026-08-14

- Separate safe DEKS product operation from the opinionated presentation-design
  method.
- Add workspace asset discovery, deterministic palette completion, slide motion
  defaults, renderer-backed QA, and explicit complexity-bound handling.
- Require exact DOM measurement coverage before clearing overflow findings.

## 0.1.2 — 2026-08-14

- Adopt the canonical DEKS 512 px opaque catalog icon.
- Add continuous element-led storytelling, idempotent recovery, evidence rules,
  rendered previews, offline icon discovery, and palette recommendations.

## 0.1.1 — 2026-08-14

- Introduce the DEKS plugin package for Claude, Codex, and ChatGPT.
- Connect shared installations through MCP OAuth and keep PAT authentication
  limited to explicit development connections.
- Add revision-safe presentation editing, guarded destructive actions, portable
  export guidance, and the first reviewer eval set.
