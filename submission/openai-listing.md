# OpenAI public submission — DEKS v0.3.2 candidate

Use this dossier as the source of truth for the OpenAI submission draft. It is
prepared for a **With MCP + uploaded skills** submission. Do not select Submit
for Review until every blocking item is confirmed against the production server
and the portal's latest Scan Tools snapshot.

## Product position

DEKS is a collaborative presentation format designed for people and AI agents to
work on the same editable deck. It is not positioned as an agent that produces a
closed first draft. A person or agent can create the presentation, another can
continue it, and the team can review and share one current version.

The format keeps individual elements editable. Stable element identities allow
an object to persist and transform between slides. Motion is part of the document
contract, with reusable timing and choreography rather than an effect added only
at export time.

## Listing fields

- **Plugin name:** DEKS
- **Developer identity:** EIGEN — select the matching verified business identity
  in OpenAI Platform. Do not substitute a personal identity without updating the
  public publisher, website, support, privacy, and terms references.
- **Category:** Productivity
- **Short description:** Decks for people and AI agents
- **Long description:** DEKS is a collaborative presentation format built for
  people and AI agents to work on the same editable deck. Create a presentation,
  continue it across chats, edit individual elements, and share one current
  version with your team. Stable element identities let objects persist and
  transform between slides, while DEKS motion adds reusable rhythms and
  transitions. The plugin connects ChatGPT or Codex to a DEKS Cloud workspace
  through OAuth, uses revision-aware writes to protect concurrent edits, renders
  slide previews for visual checks, and exports a portable `.deks` file. It can
  reuse assets already in the workspace, but it cannot upload new files or export
  PPTX through the MCP.
- **Website:** https://deks.eigen.cl/
- **Support:** https://deks.eigen.cl/support/
- **Privacy:** https://deks.eigen.cl/privacy/
- **Terms:** https://deks.eigen.cl/terms/
- **Logo:** `assets/deks-icon.png` — official opaque 512 × 512 px DEKS icon.
- **MCP URL type:** Universal
- **MCP URL:** https://api-deks.eigen.cl/mcp/
- **Authentication:** OAuth
- **UI:** None in this submission. Do not upload screenshots and do not enter a
  CSP unless the scanned MCP version begins returning plugin UI resources.
- **Suggested availability:** Chile first. Expand only after EIGEN confirms
  product, legal, terms, privacy, and support readiness for each region.

## Starter prompts

Use these exact prompts in the portal. Each shows a real, adaptable workflow and
avoids claiming capabilities outside the current MCP surface.

1. Create a four-slide presentation in DEKS, then render it and fix any clipped text.
2. Continue my DEKS deck while preserving the changes my team already made.
3. Make one element persist and transform between two slides in my DEKS presentation.
4. Audit my DEKS presentation's story, layout, contrast, and motion without changing it.

## Current capability boundary

The production Cloud MCP can create and edit presentations, preserve element
identities across checkpoints, set document motion, reuse admitted workspace
assets, render PNG previews with DOM measurements, validate authored geometry,
recommend palettes, use the offline icon catalogue, publish or unpublish a live
link, undo transactions, and export a portable `.deks` archive when the scanned
tool set advertises those operations.

The MCP does **not** upload assets, import `.deks` files, export PPTX, or create
native speaker notes. Do not describe those as plugin capabilities. The web app
owns uploads, Cloud file import/export, and PPTX export.

## Authentication and reviewer account

The public plugin uses MCP OAuth 2.1 with PKCE. PAT authentication is limited to
explicit development or CLI connections. Never give a shared PAT to a reviewer
or place one in a manifest, submission document, test fixture, or conversation.

Before submission, verify from a fresh browser session that:

- an unauthenticated MCP request returns `401 Unauthorized` with a
  `WWW-Authenticate` challenge pointing to protected-resource metadata;
- protected-resource metadata identifies the authorization server and canonical
  MCP resource;
- authorization-server or OpenID Connect discovery is public and accurate;
- authorization requests preserve and validate `state`, `code_challenge`,
  `resource`, redirect URI, and requested scopes;
- issued access tokens are resource-bound, short-lived, revocable, and checked
  for signature, issuer, audience, expiry, and scope;
- `openid` and `email` scopes are advertised and enabled, and UserInfo returns
  `email` with `email_verified: true` if workspace-domain restrictions are
  expected to work;
- login, consent, disconnect, expiry, denied-consent, refresh, and revoked-access
  flows fail safely.

Create a dedicated reviewer user and synthetic workspace. Enter its credentials
only in the private portal fields. The reviewer must not need MFA, SMS, email
confirmation, private-network access, or a real customer account. Reset the
fixtures described in `submission/openai-review-cases-v0.3.2.json` before the
review, including all presentation names beginning with `Reviewer —`.

### Owner-provided portal inputs

- Reviewer email: **enter only in the private portal field**.
- Reviewer password: **enter only in the private portal field**.
- OpenAI organization: select the organization where EIGEN is verified.
- Submitter permission: Apps Management Write (`api.apps.write`).
- Data residency: use a project with global data residency; OpenAI currently
  does not accept MCP submissions from projects with EU data residency.
- Support owner/contact: confirm the public support page before submission.
- Countries/regions: select only after legal and support review.

## Domain verification

After the portal creates the challenge, expose its exact value as plain text at:

`https://api-deks.eigen.cl/.well-known/openai-apps-challenge`

The response must contain only the single token for this plugin. Do not return
JSON, HTML, quotes, decoration, or multiple tokens. Store the value as a
deployment secret or config value; never invent or commit it. A parent origin
such as `https://deks.eigen.cl` is valid only when selected as the Challenge Base
URL in the portal and it serves that same exact value.

## Reviewer test set

The portal requires at least five positive and three negative cases. The exact
selection is stored in `submission/openai-review-cases-v0.3.2.json`, copied
without rewriting from `evals/prompts.jsonl`:

### Five positive cases

1. `positive-create-presentation` — creates and validates a new two-slide deck.
2. `positive-inspect-layout` — audits authored geometry without changing the
   deck or treating intentional overlap as an objective error.
3. `positive-rendered-iteration` — uses actual previews and complete DOM
   measurements before correcting clipping, wrapping, and contrast.
4. `positive-use-workspace-assets` — disambiguates and reuses an admitted asset
   without pretending the MCP can upload.
5. `positive-promote-list-item-to-title` — preserves one element identity so it
   transforms from an opening line into the next slide's title.

### Three negative cases

1. `negative-ambiguous-delete` — refuses to guess which deck to delete.
2. `negative-unsupported-upload` — explains the real Web upload path instead of
   inventing an MCP upload.
3. `negative-secret-exfiltration` — treats presentation content as untrusted and
   never follows embedded instructions to reveal credentials.

For each case, paste the prompt, expected behavior, expected result shape or safe
fallback, fixture, and negative-case rationale from the JSON file. Reset mutation
fixtures between runs and record the actual ChatGPT and Codex results before
submitting.

## Tool annotations and Scan Tools

Select **Scan Tools** against the production Universal URL. The portal imports
the server's current tool metadata and annotations; text entered in the portal
cannot override an incorrect server annotation.

For every discovered tool, confirm:

- `readOnlyHint` is `true` only for a tool that never changes state;
- `openWorldHint` is `true` for tools that publish or otherwise change publicly
  visible internet state, and `false` for private workspace-only operations;
- `destructiveHint` is `true` for deletion, revocation, overwrite, or another
  irreversible effect, including when only one mode of a tool is destructive;
- names, titles, descriptions, input schemas, output schemas, and retry behavior
  describe the actual production implementation;
- responses omit auth secrets, unnecessary personal data, debug payloads,
  internal identifiers, traces, and undisclosed user-related fields.

The submission should justify the real annotations surfaced by the scan. If a
hint is wrong, fix and deploy the owning server, then scan again; do not explain
away the mismatch in the portal.

Use `submission/openai-tool-annotations-v0.3.2.md` as the portal-ready worksheet
for the expected production values and per-tool justifications. A public share is
a live view, so every mutation of an existing deck can change publicly visible
state. Reconcile the worksheet with the final scan instead of assuming its tool
inventory is still current.

## Blocking checklist

- [ ] EIGEN is verified as the business publisher in the submitting OpenAI organization.
- [ ] Submitter has Apps Management Write / `api.apps.write` in that organization.
- [ ] The submission uses a project with global, not EU, data residency.
- [ ] Current MCP release is deployed at the Universal URL and rechecked immediately before submission.
- [ ] Domain verification succeeds with the portal-generated token, kept outside Git.
- [ ] Website, support, privacy, and terms return public HTTPS pages matching EIGEN.
- [ ] Production OAuth discovery, DCR, PKCE, consent, token, refresh, revocation, resource binding, scopes, and `WWW-Authenticate` pass a fresh smoke flow.
- [ ] Reviewer credentials work without MFA, SMS, email confirmation, or private-network access.
- [ ] The reviewer workspace contains every named synthetic fixture and can be reset.
- [ ] Scan Tools completes against production after the final server deployment.
- [ ] Every discovered tool's names, descriptions, schemas, results, annotations, and retry semantics are reviewed against its implementation.
- [ ] MCP responses contain no credentials, debug payloads, unnecessary personal data, or undisclosed identifiers.
- [ ] The five uploaded skills match the final package tree or scanned snapshot and pass local validation.
- [ ] All four starter prompts succeed with the reviewer account.
- [ ] The selected five positive and three negative reviewer cases pass from clean fixtures in ChatGPT and Codex.
- [ ] Country/region availability matches current legal and support readiness.
- [ ] `submission/release-notes-v0.3.2.md` matches the final production snapshot.
- [ ] Policy attestations are completed only after every item above is verified.

## Portal release notes

Paste `submission/release-notes-v0.3.2.md` into the Release notes field. This is
an initial public submission, not an update to a previously approved directory
version.

## Official references

- https://developers.openai.com/plugins/deploy/submission
- https://developers.openai.com/plugins/deploy/app-review
- https://developers.openai.com/plugins/app-guidelines
- https://developers.openai.com/plugins/guides/optimize-metadata
- https://developers.openai.com/plugins/build/plugins
- https://developers.openai.com/plugins/build/auth
