# OpenAI review finding — portal v1.0.0

Recorded on 2026-08-31 from the rejection email supplied by the user. This note
contains no reviewer credentials, tokens, session values or portal secrets.

## Evidence status

- **User-reported:** OpenAI rejected portal version `v1.0.0` because one or more
  submitted test cases did not produce the documented expected results
  consistently in ChatGPT web and mobile.
- **Verified in this checkout:** `main`, `origin/main`, `HEAD` and tag
  `deks-plugin--v0.3.3` resolve to commit `5ed54ca`, and the public manifests name
  plugin version `0.3.3`.
- **Not verified:** the portal's stored `v1.0.0` metadata and uploaded skills were
  not inspected. The relationship between portal `v1.0.0` and repository `0.3.3`
  is a supported inference, not a proven mapping.

## Findings reproduced from the preserved 0.3.3 bundle

1. `deks-cloud-mcp.zip` documents `upload_asset(file, idempotency_key)` for an
   explicitly attached image, but its final capability paragraph also says asset
   upload remains a Web or future-server workflow. Those instructions conflict.
2. `positive-promote-list-item-to-title` does not identify a unique presentation
   or the exact line to promote, and expects static checkpoint previews to confirm
   motion playback even though the skills distinguish preview QA from motion QA.
3. Several expected result shapes require exact field or section names that their
   prompts do not request, which can make otherwise correct text vary by surface.
4. Mutating reviewer fixtures require a reset before each independent run. The
   repository documents that requirement but does not contain a reset procedure
   that can be verified here.

The exact failed reviewer case remains unknown because the rejection did not name
it. These findings are remediation candidates, not proof that any single one was
the reviewer's failing execution.

## Artifact preservation and next scope

- The five ZIPs under `openai-skills-v0.3.3/` remain immutable evidence. Their
  hashes are recorded in `openai-skills-v0.3.3/SHA256SUMS`.
- The locally drifted 0.3.3 annotation worksheet was copied forward to
  `openai-tool-annotations-v0.4.0.md`; the 0.3.3 worksheet was then restored to the
  tagged `rename_element` inventory.
- The live Cloud skill may be corrected for the future 0.4.0 candidate, but its
  final inventory, cases, manifests, deployment, Scan Tools result and portal
  submission remain intentionally open.

This note does not authorize a commit, deployment, portal edit, scan, appeal,
resubmission, publication or change to the currently published plugin.
