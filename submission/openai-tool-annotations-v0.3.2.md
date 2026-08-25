# DEKS v0.3.2 — tool annotation worksheet

Use this worksheet to review the values imported by **Scan Tools** and to paste
the justification for each tool into the portal. The scanned production metadata
is authoritative. If a value differs, fix and deploy the server before scanning
again; this document cannot override a server annotation.

A published DEKS presentation is a live view, not a snapshot. Therefore any tool
that can mutate an existing presentation can also change its public view and uses
`openWorldHint: true`, even when the particular reviewer fixture is private.
Creating a new presentation creates private workspace state only.

| Tool | `readOnlyHint` | `openWorldHint` | `destructiveHint` | Portal justification |
|---|---:|---:|---:|---|
| `list_presentations` | true | false | false | Lists private workspace presentations without changing state. |
| `get_presentation` | true | false | false | Retrieves one private presentation and revision without changing state. |
| `get_slide_state` | true | false | false | Retrieves one checkpoint without changing state. |
| `list_assets` | true | false | false | Lists admitted private workspace assets without changing state. |
| `get_layout_snapshot` | true | false | false | Computes authored geometry estimates without changing state. |
| `render_slide_preview` | true | false | false | Renders a private preview and measurements without changing presentation state. |
| `validate_layout` | true | false | false | Computes layout findings without changing state. |
| `list_icon_catalog` | true | false | false | Searches the bundled offline icon catalogue without changing state. |
| `recommend_palettes` | true | false | false | Computes palette recommendations without changing state. |
| `complete_palette` | true | false | false | Computes a complete palette from supplied anchors without changing state. |
| `export_deck` | true | false | false | Reads and packages the deck as a portable `.deks` archive without mutating it. |
| `get_presentation_publication` | true | false | false | Reads publication status without changing public or private state. |
| `create_presentation` | false | false | false | Creates a new private workspace presentation; it is not publicly visible and is reversible by later explicit deletion. |
| `delete_presentation` | false | true | true | Permanently deletes a presentation and its history, and removes any live public view. |
| `set_presentation_palette` | false | true | true | Overwrites the complete palette of an existing deck; a published deck's live public view changes with it. |
| `create_slide` | false | true | false | Adds a checkpoint to an existing deck and therefore to its live public view when published. |
| `duplicate_slide` | false | true | false | Adds a copied checkpoint to an existing deck and therefore to its live public view when published. |
| `update_slide` | false | true | true | Overwrites checkpoint metadata in an existing deck; published decks reflect the change live. |
| `reorder_slides` | false | true | true | Overwrites the checkpoint order of an existing deck and its live public view. |
| `delete_slide` | false | true | true | Deletes a checkpoint from the deck and from any live public view. |
| `create_element` | false | true | false | Adds an editable element to an existing deck; published decks reflect it live. |
| `update_element_state` | false | true | true | Replaces an element state in an existing deck; published decks reflect it live. |
| `add_existing_element_state` | false | true | false | Extends an existing identity into another checkpoint; published decks reflect it live. |
| `remove_element_from_slide` | false | true | true | Deletes one element state from a checkpoint and from any live public view. |
| `rename_element` | false | true | true | Overwrites an identity's name across the existing deck; published decks reflect it live. |
| `delete_element` | false | true | true | Deletes an identity and all of its checkpoint states, including from any live public view. |
| `publish_presentation` | false | true | false | Creates publicly visible internet state at a live share URL; it can later be explicitly revoked. |
| `rotate_presentation_publication` | false | true | true | Creates a new public URL and irreversibly revokes the prior public URL. |
| `unpublish_presentation` | false | true | true | Revokes public access immediately. |
| `set_presentation_motion_beat` | false | true | true | Overwrites the presentation's motion timing; published decks reflect it live. |
| `set_motion` | false | true | true | Overwrites presence or morph motion in an existing deck; published decks reflect it live. |
| `clear_motion` | false | true | true | Removes an authored motion override and changes the inherited result in the existing deck. |
| `apply_commands` | false | true | true | Applies a mixed atomic batch to an existing deck. A batch can contain deletion operations, and published decks reflect committed changes live. |
| `undo_transaction` | false | true | true | Reverts a prior transaction and may remove or overwrite authored state; a published deck reflects the reverted state live. |

## Review notes

- Hints describe what a tool **can** do, including conditional modes, not only the
  safest example used in the reviewer fixture.
- `destructiveHint: false` does not authorize the model to write without user
  intent. Expected revisions, idempotency keys, scopes, and DEKS history remain
  separate safeguards.
- `openWorldHint: true` on ordinary deck writes follows DEKS's live publication
  contract. It does not mean the tool sends data to an unrelated third party.
- Recheck this list against the final production discovery snapshot immediately
  before submission. A newly added, removed, or renamed tool makes this worksheet
  stale.
