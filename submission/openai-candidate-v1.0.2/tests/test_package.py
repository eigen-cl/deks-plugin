import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

MODULE = Path(__file__).parents[1] / "scripts" / "package_validation.py"
spec = importlib.util.spec_from_file_location("package_validation", MODULE)
validation = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validation)


class PublicCandidateSpec(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "deks"
        self.root.mkdir()
        self.manifest = {
            "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
            "name": "deks", "version": "1.0.2", "description": "Edit presentations.",
            "author": {"name": "EIGEN"}, "extensions": {"com.openai": {
                "interface": {
                    "displayName": "DEKS", "developerName": "EIGEN", "category": "Productivity",
                    "shortDescription": "Create and edit presentations", "longDescription": "Edit DEKS presentations.",
                    "websiteURL": "https://deks.eigen.cl/", "supportURL": "https://deks.eigen.cl/support/",
                    "privacyPolicyURL": "https://deks.eigen.cl/privacy/", "termsOfServiceURL": "https://deks.eigen.cl/terms/",
                    "logo": "./assets/deks-icon.png", "composerIcon": "./assets/deks-icon.png",
                    "defaultPrompt": ["Create a presentation."]},
                "review": {"test_cases": {
                    "positive": [{"description": "Independent fixture " + str(i), "prompt": "Inspect sample " + str(i),
                                  "tools_triggered": "list_presentations", "expected_behavior": "Read only the named fixture."} for i in range(5)],
                    "negative": [{"description": "Unsupported task " + str(i), "prompt": "Unavailable task " + str(i)} for i in range(3)]}},
                "publication": {"release_notes": "Remove the generic OpenAI batch tool."}}}}
        self.write_manifest()
        (self.root / "mcp.json").write_text(json.dumps({"$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json", "mcpServers": {"deks": {
            "type": "streamable-http", "url": "https://api-deks.eigen.cl/mcp/openai/"}}}))
        for skill, entries in validation.SKILL_FILES.items():
            for entry in entries:
                path = self.root / "skills" / skill / entry
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text("---\nname: " + skill + "\ndescription: Edit DEKS presentations.\n---\nUse explicit OpenAI tools.\n" if entry == "SKILL.md" else "Reference text.\n")
        icon = self.root / "assets" / "deks-icon.png"
        icon.parent.mkdir()
        icon.write_bytes(b"\x89PNG\r\n\x1a\n" + bytes(8) + (512).to_bytes(4, "big") * 2 + bytes(8))
        names = ["list_presentations", "prepare_presentation_deletion", "confirm_delete_presentation"] + ["explicit_tool_" + str(i) for i in range(34)]
        self.contract = {"channel": "openai-v2", "resource": "https://api-deks.eigen.cl/mcp/openai/",
            "tools": [{"name": n, "description": "One explicit operation.", "inputSchema": {"type": "object"},
                       "annotations": {"readOnlyHint": True, "openWorldHint": False, "destructiveHint": False, "idempotentHint": True},
                       "_meta": {"ui": {"visibility": ["app"]}} if n == "confirm_delete_presentation" else {}}
                      for n in names],
            "resources": [{"uri": "ui://deks/confirm-presentation-deletion-v5.html"}]}

    def write_manifest(self):
        (self.root / "plugin.json").write_text(json.dumps(self.manifest))

    def test_valid_preparation_reports_missing_demo_without_inventing_one(self):
        result = validation.validate_tree(self.root, self.contract)
        self.assertIn("demo_recording_url", result["gaps"])

    def test_binding_cannot_enter_even_when_portable_manifest_shadows_it(self):
        (self.root / ".app.json").write_text("{}")
        with self.assertRaisesRegex(ValueError, r"binding|\.app"):
            validation.validate_tree(self.root, self.contract)

    def test_nonnull_apps_declaration_is_rejected(self):
        self.manifest["extensions"]["com.openai"]["apps"] = "./.app.json"
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "apps|binding"):
            validation.validate_tree(self.root, self.contract)

    def test_generic_tool_and_null_annotation_are_rejected(self):
        self.contract["tools"][0]["name"] = "apply_commands"
        with self.assertRaisesRegex(ValueError, "apply_commands"):
            validation.validate_tree(self.root, self.contract)
        self.contract["tools"][0]["name"] = "list_presentations"
        self.contract["tools"][0]["annotations"]["openWorldHint"] = None
        with self.assertRaisesRegex(ValueError, "boolean"):
            validation.validate_tree(self.root, self.contract)

    def test_missing_icon_or_unknown_expected_tool_is_rejected(self):
        self.manifest["extensions"]["com.openai"]["review"]["test_cases"]["positive"][0]["tools_triggered"] = "unknown_tool"
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "unknown_tool"):
            validation.validate_tree(self.root, self.contract)
        self.manifest["extensions"]["com.openai"]["review"]["test_cases"]["positive"][0]["tools_triggered"] = "list_presentations"
        self.write_manifest()
        (self.root / "assets" / "deks-icon.png").unlink()
        with self.assertRaisesRegex(ValueError, "icon|asset"):
            validation.validate_tree(self.root, self.contract)

    def test_zip_build_is_reproducible_and_archive_drift_is_detected(self):
        a = Path(self.temp.name) / "a.zip"
        b = Path(self.temp.name) / "b.zip"
        validation.build_zip(self.root, a)
        validation.build_zip(self.root, b)
        self.assertEqual(a.read_bytes(), b.read_bytes())
        validation.validate_archive(a, self.root)
        with zipfile.ZipFile(b, "a") as z:
            z.writestr("deks/.DS_Store", b"unrelated")
        with self.assertRaisesRegex(ValueError, "inventory|forbidden"):
            validation.validate_archive(b, self.root)

    def test_symlink_and_traversal_cannot_enter_public_package(self):
        (self.root / "assets" / "alias.png").symlink_to("deks-icon.png")
        with self.assertRaisesRegex(ValueError, "symlink"):
            validation.validate_tree(self.root, self.contract)
        with self.assertRaisesRegex(ValueError, "unsafe"):
            validation.safe_archive_name("deks/../private.txt")

    def test_preservation_hashes_detect_any_change(self):
        protected = Path(self.temp.name) / "frozen.zip"
        protected.write_bytes(b"submitted")
        baseline = {str(protected): validation.sha256(protected.read_bytes())}
        validation.validate_preservation(baseline)
        protected.write_bytes(b"modified")
        with self.assertRaisesRegex(ValueError, "protected"):
            validation.validate_preservation(baseline)

    def test_unrun_live_checks_cannot_be_claimed_submission_ready(self):
        self.assertIn("saved_version_cases", validation.submission_gaps({"gates": {"saved_version_cases": {"status": "not_run"}}}))
        complete = {"gates": {name: {"status": "verified"} for name in validation.SUBMISSION_GATES}}
        self.assertEqual(validation.submission_gaps(complete), [])

    def test_openai_translation_overlay_uses_subtitle_and_description(self):
        publication = self.manifest["extensions"]["com.openai"]["publication"]
        publication["translations"] = {"es-419": {"shortDescription": "Crea presentaciones", "longDescription": "Crea y edita."}}
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "translation field"):
            validation.validate_tree(self.root, self.contract)
        publication["translations"] = {"es-419": {"subtitle": "Crea presentaciones", "description": "Crea y edita."}}
        self.write_manifest()
        validation.validate_tree(self.root, self.contract)
        publication["translations"]["es-419"]["subtitle"] = "x" * 31
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "translated subtitle"):
            validation.validate_tree(self.root, self.contract)


class PreparedCandidateIntegrationSpec(unittest.TestCase):
    def test_actual_public_upload_matches_contract_cases_and_protected_source(self):
        candidate = Path(__file__).parents[1]
        source = candidate / "source" / "app-6a8bb31ee2b481919a609ef99cae1422"
        contract_path = candidate / "contract" / "openai-mcp-contract.json"
        contract = json.loads(contract_path.read_text())
        expected_hash = (candidate / "evidence" / "source-contract-sha256.txt").read_text().strip()
        self.assertEqual(validation.sha256(contract_path.read_bytes()), expected_hash)
        result = validation.validate_tree(source, contract)
        self.assertEqual((result["files"], result["tools"], result["model_tools"]), (22, 37, 36))
        baseline = json.loads((candidate / "evidence" / "preservation-sha256.json").read_text())
        validation.validate_preservation(baseline, candidate.parents[1])
        manifest = json.loads((source / "plugin.json").read_text())
        cases = json.loads((candidate / "review-cases.json").read_text())
        self.assertEqual(manifest["extensions"]["com.openai"]["review"]["test_cases"], {k: cases[k] for k in ["positive", "negative"]})
        tools_reference = (source / "skills" / "deks-cloud-mcp" / "references" / "tools.md").read_text()
        declared = set(validation.re.findall(r"^### `([^`]+)`$", tools_reference, validation.re.MULTILINE))
        self.assertEqual(declared, {t["name"] for t in contract["tools"]})
        for skill in validation.SKILLS:
            dependencies = (source / "skills" / skill / "agents" / "openai.yaml").read_text()
            self.assertIn(validation.ENDPOINT, dependencies)
            self.assertNotIn('url: "https://api-deks.eigen.cl/mcp/"', dependencies)
        validation.validate_archive(candidate / "dist" / "deks-openai-1.0.2.zip", source)


if __name__ == "__main__":
    unittest.main()
