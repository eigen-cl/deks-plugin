"""Validate a separate public upload and build a reproducible archive.

This module performs no network or portal operation. It never changes a legacy
source file; only the explicit archive destination is written by build_zip.
"""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import zipfile

ENDPOINT = "https://api-deks.eigen.cl/mcp/openai/"
SKILL_FILES = {
    "deks-cloud-mcp": ["SKILL.md", "agents/openai.yaml", "references/tools.md"],
    "deks-motion-patterns": ["SKILL.md", "agents/openai.yaml", "references/catalog.md"],
    "deks-presentations": ["SKILL.md", "agents/openai.yaml", "references/document-model.md", "references/motion-contract.md", "references/recovery.md", "references/validation.md"],
    "design-deks-presentations": ["SKILL.md", "agents/openai.yaml", "references/audit.md", "references/motion.md", "references/narrative.md", "references/story-and-evidence.md", "references/visual-system.md"],
}
SKILLS = tuple(SKILL_FILES)
ALLOWED = {"plugin.json", "mcp.json", "assets/deks-icon.png"} | {
    "skills/" + skill + "/" + entry for skill, entries in SKILL_FILES.items() for entry in entries
}
HINTS = ("readOnlyHint", "openWorldHint", "destructiveHint", "idempotentHint")
SUBMISSION_GATES = ("live_contract", "reviewer_access", "saved_version_cases", "demo_recording", "portal_metadata", "developer_attestations")
FORBIDDEN_PARTS = {".app.json", ".codex-plugin", ".claude-plugin", ".git", ".DS_Store", "__MACOSX", "node_modules", "__pycache__", ".env"}
SECRET_PATTERNS = (r"deks_pat_[A-Za-z0-9_-]{8,}", r"sk-[A-Za-z0-9_-]{20,}", r"Bearer\s+[A-Za-z0-9._-]{20,}")


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha256(value):
    return hashlib.sha256(value).hexdigest()


def safe_archive_name(name):
    require(name and not name.startswith("/") and "\\" not in name and "\x00" not in name, "unsafe archive path")
    parts = name.split("/")
    require(all(p not in ("", ".", "..") for p in parts), "unsafe archive path")
    require(not any(p in FORBIDDEN_PARTS for p in parts), "forbidden file or app binding")
    return PurePosixPath(name)


def files(root):
    result = {}
    for path in sorted(root.rglob("*")):
        require(not path.is_symlink(), "symlink in public upload")
        if path.is_file():
            relative = path.relative_to(root).as_posix()
            safe_archive_name(relative)
            require(relative in ALLOWED, "unrelated public-upload inventory entry: " + relative)
            result[relative] = path.read_bytes()
    return result


def no_bindings(value):
    if isinstance(value, dict):
        require("apps" not in value or value["apps"] is None, "non-null apps binding in public upload")
        for child in value.values():
            no_bindings(child)
    elif isinstance(value, list):
        for child in value:
            no_bindings(child)


def validate_contract(contract):
    require(contract.get("resource") == ENDPOINT, "wrong OpenAI contract endpoint")
    require(contract.get("channel") == "openai-v2", "candidate must use openai-v2 source contract")
    tools = contract.get("tools", [])
    names = {t.get("name") for t in tools}
    require("apply_commands" not in names, "apply_commands cannot enter the new OpenAI tool surface")
    require("delete_presentation" not in names, "legacy delete_presentation cannot enter the v2 surface")
    require(len(tools) == len(names) == 37, "expected 37 unique explicit descriptors")
    require({"prepare_presentation_deletion", "confirm_delete_presentation"} <= names, "deletion flow inventory is incomplete")
    private = []
    for tool in tools:
        for hint in HINTS:
            require(type(tool.get("annotations", {}).get(hint)) is bool, tool["name"] + ": expected explicit boolean " + hint)
        require(isinstance(tool.get("description"), str) and tool["description"].strip(), "empty tool description")
        require(isinstance(tool.get("inputSchema"), dict), "missing input schema")
        meta = tool.get("_meta", {})
        if meta.get("ui", {}).get("visibility") == ["app"] or meta.get("openai/visibility") == "private":
            private.append(tool["name"])
    require(private == ["confirm_delete_presentation"], "expected exactly one app-only executor and 36 model tools")
    require(any(r.get("uri") == "ui://deks/confirm-presentation-deletion-v5.html" for r in contract.get("resources", [])), "missing v5 deletion UI")
    return names


def validate_tree(root, contract):
    inventory = files(root)
    require(set(inventory) == ALLOWED, "public upload inventory is incomplete (skill reference or icon asset missing)")
    manifest = json.loads(inventory["plugin.json"])
    require(manifest.get("$schema") == "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", "missing official portable manifest schema")
    no_bindings(manifest)
    require(not {"skills", "mcpServers", "apps", "interface"} & manifest.keys(), "nonportable root manifest or apps binding")
    require(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", manifest.get("name", "")) and len(manifest["name"]) <= 64, "invalid package name")
    require(manifest.get("version") == "1.0.2", "wrong portal candidate version")
    require(isinstance(manifest.get("author", {}).get("name"), str), "missing publisher identity")
    openai = manifest.get("extensions", {}).get("com.openai", {})
    interface = openai.get("interface", {})
    for key, limit in (("displayName", 30), ("shortDescription", 30), ("longDescription", 4000), ("developerName", 80)):
        value = interface.get(key)
        require(isinstance(value, str) and 0 < len(value) <= limit, "missing or oversized listing field: " + key)
    require(interface.get("category") == "Productivity", "wrong listing category")
    for key in ("websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL"):
        value = interface.get(key, "")
        require(isinstance(value, str) and value.startswith("https://deks.eigen.cl/") and "@" not in value and len(value) <= 1024, "invalid listing URL: " + key)
    prompts = interface.get("defaultPrompt")
    prompts = [prompts] if isinstance(prompts, str) else prompts
    require(isinstance(prompts, list) and 1 <= len(prompts) <= 3, "invalid starter prompts")
    require(all(isinstance(p, str) and p.strip() and len(p) <= 128 and "\n" not in p and "\r" not in p and "@" not in p for p in prompts), "invalid starter prompt")
    require(len({" ".join(p.split()) for p in prompts}) == len(prompts), "duplicate starter prompt")
    for key in ("logo", "composerIcon"):
        require(interface.get(key) in ("./assets/deks-icon.png", "assets/deks-icon.png"), "invalid contained icon asset")
    png = inventory["assets/deks-icon.png"]
    require(len(png) <= 5 * 1024 * 1024 and png[:8] == b"\x89PNG\r\n\x1a\n", "invalid PNG icon")
    require(len(png) >= 24 and int.from_bytes(png[16:20], "big") == int.from_bytes(png[20:24], "big") == 512, "DEKS icon must be 512 square")
    mcp = json.loads(inventory["mcp.json"])
    require(mcp.get("$schema") == "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json", "missing official portable MCP schema")
    no_bindings(mcp)
    require(list(mcp.get("mcpServers", {})) == ["deks"], "expected exactly one DEKS MCP server")
    require(mcp["mcpServers"]["deks"] == {"type": "streamable-http", "url": ENDPOINT}, "wrong transport, endpoint or authentication override")
    names = validate_contract(contract)
    cases = openai.get("review", {}).get("test_cases", {})
    require(len(cases.get("positive", [])) == 5 and len(cases.get("negative", [])) == 3, "expected five positive and three negative cases")
    all_prompts = []
    for kind in ("positive", "negative"):
        for case in cases[kind]:
            for key in ("description", "prompt"):
                require(isinstance(case.get(key), str) and case[key].strip(), "missing case " + key)
            require(not any(re.search(r"\b" + re.escape(n) + r"\b", case["prompt"]) for n in names), "user prompt prescribes a tool instead of a natural goal")
            all_prompts.append(case["prompt"])
            if kind == "positive":
                require(isinstance(case.get("tools_triggered"), str) and isinstance(case.get("expected_behavior"), str) and case["expected_behavior"].strip(), "invalid positive case expectation")
                expected = {n.strip() for n in case["tools_triggered"].split(",") if n.strip()}
                require(expected and expected <= names, "unknown expected tool: " + ", ".join(sorted(expected - names)))
    require(len(set(all_prompts)) == 8, "review cases must be independent and distinct")
    require(isinstance(openai.get("publication", {}).get("release_notes"), str) and openai["publication"]["release_notes"].strip(), "missing release notes")
    translations = openai.get("publication", {}).get("translations", {})
    require(isinstance(translations, dict), "translations must be keyed by locale")
    for locale, translation in translations.items():
        require(isinstance(locale, str) and locale != "en-US" and isinstance(translation, dict), "invalid translation locale")
        require(set(translation) <= {"subtitle", "description"}, "unsupported translation field: use subtitle and description")
        for key, limit in (("subtitle", 30), ("description", 4000)):
            if key in translation:
                require(isinstance(translation[key], str) and 0 < len(translation[key]) <= limit, "invalid translated " + key)
    for skill in SKILLS:
        text = inventory["skills/" + skill + "/SKILL.md"].decode()
        require(text.startswith("---\n") and "\nname: " + skill + "\n" in text and "\ndescription:" in text, "invalid skill frontmatter: " + skill)
    for name, data in inventory.items():
        if name.endswith((".json", ".md", ".yaml")):
            text = data.decode("utf8")
            require(not any(re.search(pattern, text) for pattern in SECRET_PATTERNS), "secret-shaped value in " + name)
    gaps = []
    demo = openai.get("review", {}).get("demo_recording_url")
    if not demo:
        gaps.append("demo_recording_url")
    else:
        require(isinstance(demo, str) and demo.startswith("https://") and "@" not in demo, "invalid demo URL")
    return {"files": len(inventory), "tools": len(names), "model_tools": len(names) - 1, "cases": "5+3", "gaps": gaps}


def build_zip(root, destination):
    inventory = files(root)
    destination.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, content in sorted(inventory.items()):
            entry = zipfile.ZipInfo(root.name + "/" + name, date_time=(1980, 1, 1, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, content, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)


def validate_archive(archive_path, root):
    inventory = files(root)
    expected = {root.name + "/" + name: content for name, content in inventory.items()}
    with zipfile.ZipFile(archive_path) as archive:
        names = archive.namelist()
        for name in names:
            safe_archive_name(name)
        require(len(names) == len(set(names)) and set(names) == set(expected), "archive inventory differs from source")
        for name in names:
            entry = archive.getinfo(name)
            require(entry.date_time == (1980, 1, 1, 0, 0, 0) and entry.external_attr >> 16 == 0o100644, "archive metadata is not deterministic")
            require(archive.read(name) == expected[name], "archive bytes differ: " + name)
    return sha256(archive_path.read_bytes())


def validate_preservation(baseline, base=None):
    for name, expected in baseline.items():
        path = Path(name) if base is None else base / name
        require(path.is_file() and sha256(path.read_bytes()) == expected, "protected source changed: " + name)


def submission_gaps(readiness):
    gates = readiness.get("gates", {})
    return [name for name in SUBMISSION_GATES if gates.get(name, {}).get("status") not in ("passed", "verified", "developer_completed")]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--build", action="store_true")
    parser.add_argument("--submission-ready", action="store_true")
    options = parser.parse_args()
    candidate = Path(__file__).resolve().parents[1]
    source = candidate / "source" / "app-6a8bb31ee2b481919a609ef99cae1422"
    contract = json.loads((candidate / "contract" / "openai-mcp-contract.json").read_text())
    baseline = json.loads((candidate / "evidence" / "preservation-sha256.json").read_text())
    validate_preservation(baseline, candidate.parents[1])
    result = validate_tree(source, contract)
    archive = candidate / "dist" / "deks-openai-1.0.2.zip"
    if options.build:
        build_zip(source, archive)
    if archive.exists():
        result["archive_sha256"] = validate_archive(archive, source)
    readiness_path = candidate / "readiness.json"
    readiness = json.loads(readiness_path.read_text()) if readiness_path.exists() else {}
    result["submission_gaps"] = submission_gaps(readiness)
    require(not options.submission_ready or not result["gaps"] + result["submission_gaps"], "submission preparation incomplete: " + ", ".join(result["gaps"] + result["submission_gaps"]))
    print(json.dumps(result, sort_keys=True))


if __name__ == "__main__":
    main()
