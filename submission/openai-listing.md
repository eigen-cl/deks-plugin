# OpenAI public submission — DEKS v0.1.2 candidate

Use this as the source of truth for the submission portal. Do not submit until every blocking checklist item is confirmed against production.

## Listing

- **Plugin name:** DEKS
- **Developer identity:** EIGEN — select the matching verified business identity in OpenAI Platform; do not substitute a personal identity without updating all public publisher references.
- **Category:** Productivity
- **Short description:** Create polished, animated presentations with AI.
- **Long description:** DEKS helps you create, edit, animate, inspect, and validate presentations in your own workspace. Build slide narratives, preserve visual continuity between slides, review layout collisions, and export a portable `.deks` file. Every write is revision-aware, destructive actions require explicit intent, and public connections authenticate through OAuth.
- **Website:** https://deks.eigen.cl
- **Support:** https://deks.eigen.cl/support
- **Privacy:** https://deks.eigen.cl/privacy
- **Terms:** https://deks.eigen.cl/terms
- **MCP URL type:** Universal
- **MCP URL:** https://api-deks.eigen.cl/mcp/
- **Suggested availability:** Chile first. Expand only after support and legal coverage are confirmed for each additional region.

The website, support, privacy, and terms URLs are planned production URLs. Confirm that each returns public content over HTTPS and identifies EIGEN before entering them in the portal.

## Starter prompts

1. Create a polished four-slide product launch in DEKS.
2. Improve the hierarchy, gradients, and motion of my DEKS deck.
3. Audit my presentation for layout collisions without changing it.

## Authentication and reviewer account

The public plugin must use MCP OAuth 2.1 with PKCE. PAT authentication is limited to development and direct CLI connections; never give a shared PAT to reviewers or place one in a manifest.

Before submission, verify in an incognito browser that:

- an unauthenticated MCP request returns `401 Unauthorized` with `WWW-Authenticate` pointing to protected-resource metadata;
- protected-resource metadata identifies the authorization server and the canonical MCP resource;
- authorization-server or OpenID Connect discovery is public and accurate;
- authorization requests preserve and validate `state`, `code_challenge`, `resource`, redirect URI, and requested scopes;
- issued tokens are audience/resource-bound, short-lived, revocable, and checked for signature, issuer, audience, expiry, and scope;
- `openid` and `email` scopes are advertised and enabled, and UserInfo returns `email` plus `email_verified: true` for workspace-domain restrictions;
- Google is offered as an upstream login method inside DEKS OAuth, without making Google tokens the MCP access tokens;
- login, consent, disconnect, expired-token, denied-consent, and revoked-access flows behave safely.

Create a dedicated reviewer user and workspace. Provide credentials only in the private portal fields. The reviewer login must not require MFA, SMS, email confirmation, private-network access, or access to a real customer account. Seed only synthetic content described in `evals/prompts.jsonl`, reset it before review, and make `Reviewer — Delete me` disposable and re-creatable.

Required owner inputs before submission:

- final reviewer email and password, entered privately;
- confirmation that the selected OpenAI organization has Apps Management write access;
- confirmation that EIGEN's business identity is verified in that same organization;
- final support owner/contact shown on the public support page;
- selected countries/regions after legal and support review.

## Domain verification

When the submission portal generates a challenge, expose the exact token as plain text at:

`https://api-deks.eigen.cl/.well-known/openai-apps-challenge`

The response must contain only the single token for this plugin: no JSON, HTML, quotes, whitespace decoration, or multiple tokens. Store the portal-generated value as a deployment secret or config value; never invent it or commit it. Verify the production URL, complete the portal check, and preserve the value while the reviewed plugin version needs it. A parent origin such as `https://deks.eigen.cl` is acceptable only if selected in the portal and it hosts the exact token.

## Reviewer test set

Upload or transcribe all 17 cases from `evals/prompts.jsonl`: ten positive and seven negative. Reset fixture data between destructive or mutation-heavy cases. The expected behavior and result shape are part of each positive case; every negative case records the safe fallback and why the requested action must not be completed.

## Blocking checklist

- [ ] EIGEN is verified as the publisher in the submitting OpenAI organization.
- [ ] Submitter has Apps Management write permission in that organization.
- [ ] Current MCP release is deployed at the Universal URL and rechecked immediately before submission.
- [ ] `create_presentation` and guarded `delete_presentation` are present in the discovered production tool set.
- [ ] Every discovered production tool has reviewed names, descriptions, schemas, result shapes, and `readOnlyHint`, `openWorldHint`, and `destructiveHint` values.
- [ ] OAuth discovery, DCR, PKCE, consent, token, refresh, revocation, resource/audience binding, scopes, and `WWW-Authenticate` behavior pass a fresh production smoke flow.
- [ ] Google login is configured as an upstream identity option and its consent screen uses verified branding.
- [ ] Website, support, privacy, and terms URLs return public HTTPS pages that match EIGEN.
- [ ] The portal-generated domain token is served exactly at the chosen challenge URL.
- [ ] MCP responses contain no credentials, debug payloads, unnecessary personal data, or undisclosed identifiers.
- [ ] Final skill tree passes local validation and matches the uploaded or scanned snapshot.
- [ ] All three starter prompts succeed with the reviewer account.
- [ ] All ten positive and seven negative reviewer cases pass from a clean fixture.
- [ ] Reviewer credentials work without MFA, SMS, email verification, or private-network access.
- [ ] Country/region availability matches actual legal and support readiness.
- [ ] Release notes below match the final production version.

## Portal release notes — v0.1.2 candidate

Public submission candidate for DEKS in ChatGPT and Codex. The plugin uses the approved opaque 512 px DEKS icon, connects to a user's workspace through OAuth, and provides presentation creation, revision-safe editing, rendered preview QA, palette and icon discovery, layout validation, motion choreography, guarded deletion, and portable `.deks` export, subject to the tool contract rescanned for the submitted version. It includes a workflow skill, three starter prompts, and ten positive plus seven negative reviewer cases. Reviewer credentials point to a synthetic workspace; the disposable deletion fixture must be reset before that case. Confirm capability boundaries against the submitted MCP snapshot.

## Official references

- https://developers.openai.com/plugins/deploy/submission
- https://developers.openai.com/plugins/build/auth
- https://developers.openai.com/plugins/deploy/connect-chatgpt
