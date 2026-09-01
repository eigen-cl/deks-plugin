# OpenAI public submission — DEKS v0.4.1 candidate

## Product

DEKS is a collaborative presentation format for people and AI agents working on
the same editable deck. A person or agent can create a presentation, another can
continue it, and the team can review and share one current version.

Stable element identities allow objects to persist and transform between slides.
Logical groups organize related elements without changing their absolute layout.
Motion, palettes and optional per-slide narration are part of the portable
document rather than effects added only at export time.

## Listing fields

- **Plugin name:** DEKS
- **Developer:** EIGEN
- **Category:** Productivity
- **Short description:** Decks for people and AI agents
- **Long description:** DEKS helps people and AI agents create, continue, review
  and share the same editable presentation. Stable element identities preserve
  continuity between slides, while typed states, logical groups, reusable motion
  and portable narration keep the deck open for further editing. Through ChatGPT,
  DEKS can read and edit a Cloud workspace, validate authored geometry, render
  slide previews, reuse workspace images, publish a live presentation and export
  a portable `.deks` file.
- **Website:** https://deks.eigen.cl/
- **Support:** https://deks.eigen.cl/support/
- **Privacy:** https://deks.eigen.cl/privacy/
- **Terms:** https://deks.eigen.cl/terms/
- **MCP URL:** https://api-deks.eigen.cl/mcp/
- **Authentication:** OAuth
- **Logo:** `assets/deks-icon.png`

## Capabilities

DEKS can create and edit presentations, preserve element identities across
slides, organize elements into logical groups, add or clear portable narration,
set motion and palettes, validate geometry, render PNG previews, reuse admitted
workspace images, publish or revoke a live link, undo transactions and export a
portable `.deks` archive.

`upload_asset` accepts only an image explicitly attached by the user. It does not
read a path mentioned in chat and does not accept narration audio. Narration may
reference supported audio already embedded in the deck. `.deks` import and PPTX
export remain in the web app. Permanent presentation deletion is also Web-only;
the MCP and ChatGPT do not expose it.

## Starter prompts

1. Create a four-slide presentation in DEKS, then render it and fix any clipped text.
2. Continue my DEKS deck while preserving the changes my team already made.
3. Add a concise script and pauses to each slide so I can rehearse the story.
4. Audit my DEKS presentation's story, layout, contrast and motion without changing it.

## Reviewer cases

The candidate uses these exact deterministic fixtures from
`openai-review-cases-v0.4.1.json`:

### Positive

1. `positive-core6-layout-read`
2. `positive-set-slide-narration`
3. `positive-revision-idempotency-recovery`
4. `positive-publish-presentation`
5. `positive-untrusted-slide-security-audit`

### Negative

1. `negative-unsupported-presentation-delete`
2. `negative-unattached-local-file`
3. `negative-direct-secret-exfiltration`

Each case is run from a freshly reset synthetic workspace in a new conversation.
Web and mobile runs use independent resets so mutations and idempotency receipts
cannot leak from one surface to the other.
