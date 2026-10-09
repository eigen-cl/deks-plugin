"""Copy a verified source contract and update only the candidate tool reference."""
import argparse
import json
from pathlib import Path

from package_validation import sha256, validate_contract, validate_preservation

parser = argparse.ArgumentParser()
parser.add_argument("--source", type=Path, required=True)
parser.add_argument("--sha256", required=True)
options = parser.parse_args()
candidate = Path(__file__).resolve().parents[1]
baseline = json.loads((candidate / "evidence" / "preservation-sha256.json").read_text())
validate_preservation(baseline, candidate.parents[1])
data = options.source.read_bytes()
if sha256(data) != options.sha256:
    raise ValueError("Source contract does not match the explicitly verified hash")
contract = json.loads(data)
validate_contract(contract)
destination = candidate / "contract" / "openai-mcp-contract.json"
destination.write_bytes(data)
lines = [
    "# Explicit OpenAI tool map", "",
    "This reference describes the candidate source contract. Use the actual discovered",
    "schemas before calling; local documentation does not prove deployment or availability.",
    "The configured endpoint is `https://api-deks.eigen.cl/mcp/openai/`. It uses OAuth.",
    "There is no generic command dispatcher. Never switch channels to bypass a missing tool.", "",
    "Read current presentation state before planning writes. Each mutation is a separate",
    "transaction with its own revision and idempotency key where declared by the input.",
    "Only the human-operated confirmation card may invoke the private deletion executor.", "",
    "## State and continuity", "",
    "`create_element` declares a new identity and its first state. Continue an existing",
    "object with `add_existing_element_state`; use `update_element_state` for local changes.",
    "Geometry x/y/width/height is required; omitted opacity/z_index/rotation_deg uses",
    "1/0/0 and omitted anchor clears it. Optional subtype fields remain unchanged.",
    "Read existing state to preserve common fields and anchor. Shared identity changes affect",
    "every slide carrying that identity. A new authored phrase across slides needs a new",
    "text identity; an explicit correction updates the existing identity globally.",
    "Logical groups preserve absolute geometry. Numeric values and formatting use the",
    "declared numeric inputs; do not replace a continuing number identity with text.", "",
    "## Review and media boundaries", "",
    "Resolve one exact named presentation for permanent deletion and read it immediately",
    "before preparation. Alternatives or delegated target choices need clarification",
    "with zero DEKS tool calls. Preparation leaves data intact; only the v5 card and one",
    "human click may execute deletion. Never request, expose or reconstruct its hidden token.",
    "Image upload accepts a host-provided attachment, not arbitrary URLs, local paths or",
    "narration audio. New audio admission, .deks import and PowerPoint export are outside",
    "this OpenAI surface. A public share shows current content, so edits change it live.", "",
    "## Tools", "",
]
for tool in contract["tools"]:
    schema = tool["inputSchema"]
    lines += ["### `" + tool["name"] + "`", "", tool["description"].strip(), ""]
    lines += ["Required inputs: " + (", ".join("`" + n + "`" for n in schema.get("required", [])) or "none") + "."]
    lines += ["Declared inputs: " + (", ".join("`" + n + "`" for n in schema.get("properties", {})) or "none") + "."]
    annotations = tool["annotations"]
    lines += ["Safety annotations: " + ", ".join("`" + k + ": " + str(annotations[k]).lower() + "`" for k in ("readOnlyHint", "openWorldHint", "destructiveHint", "idempotentHint")) + ".", ""]
    if tool["name"] == "confirm_delete_presentation":
        lines += ["App-only/private. The model must never call this tool; only the human confirmation card may call it.", ""]
reference = candidate / "source" / "app-6a8bb31ee2b481919a609ef99cae1422" / "skills" / "deks-cloud-mcp" / "references" / "tools.md"
reference.write_text("\n".join(lines) + "\n")
(candidate / "evidence" / "source-contract-sha256.txt").write_text(options.sha256 + "\n")
print(json.dumps({"contract_sha256": options.sha256, "tools": len(contract["tools"]), "protected_source_unchanged": True}))
