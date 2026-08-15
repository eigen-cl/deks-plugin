# Claude community submission — DEKS v0.1.5 candidate

Use this document as the source of truth for the Anthropic submission form. Do
not submit until every blocking item below has been verified against the exact
public source commit and production MCP release under review.

## Publication channel

- **Third-party destination:** `deks-plugin@claude-community`
- **Community catalog:** `anthropics/claude-plugins-community`
- **Independent marketplace:** `deks-plugin@eigen-plugins`
- **Official marketplace:** not a submission target; Anthropic curates
  `claude-plugins-official` separately.

The independently distributed source is
`https://github.com/eigen-cl/deks-plugin`. A community submission must reference
the exact public release commit reviewed by Anthropic.

## Listing

- **Plugin name:** DEKS
- **Plugin slug:** `deks-plugin`
- **Developer:** EIGEN
- **Developer contact:** hola@eigen.cl
- **Developer website:** https://eigen.cl
- **Category:** Productivity
- **Short description:** Create polished, animated presentations with AI.
- **Long description:** DEKS helps people create, edit, animate, inspect, and
  validate presentations in their own workspace. One skill governs exact,
  revision-safe product operations; a separate design skill guides narrative,
  cohesive palettes, section continuity, semantic motion, and rendered audits.
  Users can reuse workspace assets, preserve stable visual identities between
  checkpoints, and export portable `.deks` files. Destructive actions require
  explicit intent, and the remote connection authenticates through OAuth.
- **Source:** https://github.com/eigen-cl/deks-plugin
- **License:** Apache-2.0
- **Website:** https://deks.eigen.cl
- **Support:** https://deks.eigen.cl/support
- **Privacy:** https://deks.eigen.cl/privacy
- **Terms:** https://deks.eigen.cl/terms
- **MCP endpoint:** https://api-deks.eigen.cl/mcp/
- **MCP documentation:** https://deks.eigen.cl/docs/mcp

## Working prompts

1. Create a coherent four-slide product launch in DEKS using the design
   methodology.
2. Improve the hierarchy, gradients, and motion of my DEKS deck.
3. Audit my presentation's story, palette, layout, and transitions without
   changing it.

Each prompt must be run successfully from a clean reviewer fixture before
submission. Do not treat a local skill-only response as evidence that the
production OAuth connection and MCP tools worked.

## Data and remote-service behavior

- The plugin package contains no OAuth token, PAT, cookie, reviewer credential,
  or shared authorization header.
- Enabling the plugin adds the remote DEKS MCP endpoint. The manifest uses
  `defaultEnabled: false` so this external connection remains an explicit user
  choice.
- Shared installations authenticate through DEKS OAuth in the browser. The MCP
  advertises `openid`, `email`, `read`, `write`, and `offline_access`; the user
  selects a DEKS workspace and consents to the requested access.
- Claude sends DEKS only the structured tool arguments necessary for the user
  request. The plugin does not direct Claude to extract memory, unrelated chat
  history, conversation summaries, or unrelated uploaded files.
- Tool calls may read or write presentation names, text, element geometry,
  transitions, palette values, workspace asset metadata, and publication state
  in the authorized workspace.
- `render_slide_preview` returns a private rendered PNG and layout measurements
  to Claude for visual QA. `export_deck` may return a portable `.deks` artifact
  when the production server exposes it.
- Data collection, subprocessors, retention, deletion, and user rights are
  described in the public privacy policy. Keep this submission synchronized
  with that policy rather than copying retention claims that can drift.
- Users can review and revoke DEKS OAuth connections from DEKS. A reviewer must
  verify denial, expiry, refresh, disconnect, and revocation behavior against
  production.

## Authentication and reviewer fixture

Public review must use OAuth 2.1 authorization code with PKCE S256, protected
resource metadata, dynamic client registration, exact redirect validation, and
resource-bound access. Never provide a PAT to Anthropic as the shared review
flow.

- **Reviewer email:** `[PRIVATE CREDENTIAL PLACEHOLDER — enter only in the Anthropic submission portal]`
- **Reviewer password or login instructions:** `[PRIVATE CREDENTIAL PLACEHOLDER — enter only in the Anthropic submission portal]`
- **Reviewer workspace:** `[FIXTURE PLACEHOLDER — create a synthetic workspace that matches evals/prompts.jsonl]`
- **Fixture reset owner/procedure:** `[FIXTURE PLACEHOLDER — document who resets mutation and deletion cases before review]`

The account must not expose customer data or require MFA, SMS, private-network
access, or access to an employee's personal workspace. Seed synthetic data only.
The disposable `Reviewer — Delete me` presentation must be recoverable before
each destructive test.

## Reviewer eval set

The current `evals/prompts.jsonl` contains **16 positive** and **12 negative**
cases. This count is derived from the v0.1.5 source tree and must be recalculated
if the file changes before submission.

Run all cases from reset fixtures. In particular, verify:

- revision conflicts and uncertain-write recovery;
- guarded deletion and ambiguous destructive requests;
- prompt injection and credential-exfiltration resistance;
- renderer/DOM diagnostic completeness;
- stable element identities and section-level spatial continuity;
- one central motion per edge without arbitrary UI-element drift;
- honest handling of unsupported upload and complexity-limit requests.

## Blocking checklist

- [ ] The submitted source repository is public and resolves to the exact clean
      commit under review.
- [ ] `LICENSE`, `CHANGELOG.md`, README, manifest metadata, and public listing
      all match version `0.1.5`.
- [ ] `claude plugin validate . --strict` passes from a clean checkout.
- [ ] Installation from the final public repository succeeds in a fresh Claude
      profile, remains disabled until explicitly enabled, and exposes both
      skills plus the expected MCP server.
- [ ] The production MCP tool list matches the submitted skill contract.
- [ ] Every production tool has a reviewed name, human-readable title,
      description, input schema, result shape, and correct `readOnlyHint`,
      `destructiveHint`, `idempotentHint`, and `openWorldHint` values.
- [ ] Tool names are at most 64 characters and errors provide actionable,
      non-secret feedback.
- [ ] OAuth discovery, dynamic client registration, PKCE, consent, token,
      refresh, revocation, resource binding, scopes, and `WWW-Authenticate`
      behavior pass a fresh production smoke flow from Claude.
- [ ] The three working prompts succeed through the production MCP connection.
- [ ] All 16 positive and 12 negative eval cases pass from reset synthetic
      fixtures.
- [ ] The reviewer credentials and fixture instructions work without MFA, SMS,
      private-network access, or real customer data.
- [ ] Website, support, privacy, terms, MCP documentation, and developer contact
      are public over HTTPS and identify EIGEN consistently.
- [ ] MCP results contain no credentials, debug payloads, unnecessary personal
      data, or undisclosed identifiers.
- [ ] EIGEN owns or controls the declared domains, endpoint, branding, and source
      rights and can maintain the plugin after publication.
- [ ] The submitter has reviewed and accepted the current Anthropic Software
      Directory Policy and Software Directory Terms.
- [ ] Submission is sent through the authenticated Anthropic form and approval
      is confirmed in `anthropics/claude-plugins-community`; no direct pull
      request is opened against that read-only mirror.

## Official references

- https://code.claude.com/docs/en/plugins#submit-your-plugin-to-the-community-marketplace
- https://code.claude.com/docs/en/plugin-marketplaces
- https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy
- https://support.claude.com/en/articles/13145338-anthropic-software-directory-terms
- https://github.com/anthropics/claude-plugins-community
