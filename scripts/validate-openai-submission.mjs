import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = (path) => readFileSync(join(root, path));
const read = (path) => file(path).toString("utf8");
const json = (path) => JSON.parse(read(path));
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

function readZip(path) {
  const archive = file(path);
  const endSignature = 0x06054b50;
  const centralSignature = 0x02014b50;
  const localSignature = 0x04034b50;
  let end = -1;
  for (let offset = archive.length - 22; offset >= Math.max(0, archive.length - 65_557); offset -= 1) {
    if (archive.readUInt32LE(offset) === endSignature) { end = offset; break; }
  }
  assert.notEqual(end, -1, `${path} is missing its ZIP end record`);
  assert.equal(archive.readUInt16LE(end + 4), 0, `${path} must not be multi-disk`);
  assert.equal(archive.readUInt16LE(end + 6), 0, `${path} must not be multi-disk`);
  const count = archive.readUInt16LE(end + 10);
  const centralSize = archive.readUInt32LE(end + 12);
  const centralOffset = archive.readUInt32LE(end + 16);
  assert.ok(centralOffset + centralSize <= end, `${path} has an invalid central directory`);

  const entries = new Map();
  let offset = centralOffset;
  for (let index = 0; index < count; index += 1) {
    assert.equal(archive.readUInt32LE(offset), centralSignature, `${path} has an invalid entry`);
    const flags = archive.readUInt16LE(offset + 8);
    const method = archive.readUInt16LE(offset + 10);
    const compressedSize = archive.readUInt32LE(offset + 20);
    const size = archive.readUInt32LE(offset + 24);
    const nameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    const localOffset = archive.readUInt32LE(offset + 42);
    const name = archive.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    assert.equal(flags & 1, 0, `${path}:${name} must not be encrypted`);
    assert.ok(method === 0 || method === 8, `${path}:${name} has unsupported compression`);
    assert.ok(name && !name.startsWith("/") && !name.includes("\\") && !name.split("/").includes(".."), `${path}:${name} is unsafe`);
    assert.equal(archive.readUInt32LE(localOffset), localSignature, `${path}:${name} has no local header`);
    const localNameLength = archive.readUInt16LE(localOffset + 26);
    const localExtraLength = archive.readUInt16LE(localOffset + 28);
    const localName = archive.subarray(localOffset + 30, localOffset + 30 + localNameLength).toString("utf8");
    assert.equal(localName, name, `${path}:${name} disagrees with its local header`);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = archive.subarray(dataOffset, dataOffset + compressedSize);
    const contents = method === 0 ? compressed : inflateRawSync(compressed);
    assert.equal(contents.length, size, `${path}:${name} has the wrong size`);
    if (!name.endsWith("/")) {
      assert.ok(!entries.has(name), `${path} repeats ${name}`);
      entries.set(name, contents);
    }
    offset += 46 + nameLength + extraLength + commentLength;
  }
  assert.equal(offset, centralOffset + centralSize, `${path} has trailing central-directory data`);
  return { archive, entries };
}

function checksumMap(version) {
  return new Map(read(`submission/openai-skills-v${version}/SHA256SUMS`).trim().split("\n").map((line) => {
    const match = line.match(/^([a-f0-9]{64})  ([a-z0-9-]+\.zip)$/);
    assert.ok(match, `invalid v${version} checksum line: ${line}`);
    return [match[2], match[1]];
  }));
}

const version = "0.4.0";
const evidenceVersion = "0.3.3";
const skillEntries = new Map([
  ["deks-cloud-mcp", ["SKILL.md", "agents/openai.yaml", "references/tools.md"]],
  ["deks-desktop-mcp", ["SKILL.md", "agents/openai.yaml", "references/commands.md"]],
  ["deks-motion-patterns", ["SKILL.md", "agents/openai.yaml", "references/catalog.md"]],
  ["deks-presentations", ["SKILL.md", "agents/openai.yaml", "references/document-model.md", "references/motion-contract.md", "references/recovery.md", "references/validation.md"]],
  ["design-deks-presentations", ["SKILL.md", "agents/openai.yaml", "references/audit.md", "references/motion.md", "references/narrative.md", "references/story-and-evidence.md", "references/visual-system.md"]],
]);

const manifest = json(".codex-plugin/plugin.json");
const claudeManifest = json(".claude-plugin/plugin.json");
const marketplace = json(".claude-plugin/marketplace.json");
const mcp = json(".mcp.json");
const reviewCases = json(`submission/openai-review-cases-v${version}.json`);
const submission = json("chatgpt-app-submission.json");
const listing = read("submission/openai-listing.md");
const publicListing = read(`submission/openai-listing-v${version}.md`);
const portal = read(`submission/openai-portal-draft-v${version}.md`);
const releaseNotes = read(`submission/release-notes-v${version}.md`);
const annotations = read(`submission/openai-tool-annotations-v${version}.md`);
const cloudSkill = read("skills/deks-cloud-mcp/SKILL.md");
const cloudTools = read("skills/deks-cloud-mcp/references/tools.md");
const finding = read("submission/openai-review-finding-portal-v1.0.0.md");
const evals = read("evals/prompts.jsonl").trim().split("\n").map((line, index) => {
  try { return JSON.parse(line); } catch (error) { throw new Error(`evals/prompts.jsonl:${index + 1}: ${error.message}`); }
});

assert.equal(manifest.version, version);
assert.equal(claudeManifest.version, version);
assert.equal(marketplace.plugins.find(({ name }) => name === "deks-plugin")?.version, version);
assert.equal(mcp.mcpServers.deks.url, "https://api-deks.eigen.cl/mcp/");
assert.ok(manifest.interface.shortDescription.length <= 30);
for (const name of skillEntries.keys()) assert.ok(statSync(join(root, "skills", name, "SKILL.md")).isFile());

assert.equal(evals.length, 8, "evals must contain only the reviewed 5+3 set");
assert.equal(evals.filter(({ kind }) => kind === "positive").length, 5);
assert.equal(evals.filter(({ kind }) => kind === "negative").length, 3);
const sourceById = new Map(evals.map((entry) => [entry.id, entry]));
assert.equal(sourceById.size, 8, "eval IDs must be unique");
assert.equal(reviewCases.version, version);
assert.equal(reviewCases.positive.length, 5);
assert.equal(reviewCases.negative.length, 3);
assert.ok(reviewCases.reset_protocol.some((line) => /web/i.test(line) && /mobile/i.test(line)));
for (const entry of [...reviewCases.positive, ...reviewCases.negative]) {
  assert.deepEqual(entry, sourceById.get(entry.id), `${entry.id} must be copied exactly from evals`);
  assert.ok(listing.includes(`\`${entry.id}\``), `${entry.id} missing from listing`);
}
for (const entry of reviewCases.positive) {
  assert.match(entry.prompt, /exactly/i);
  assert.match(entry.prompt, /End with exactly/i);
  assert.match(entry.prompt, /End with exactly[^\n]*\n[^\n]+:\n/);
  assert.doesNotMatch(entry.prompt, /labeled lines:[^\n]*;/);
  assert.ok(entry.expected_result_shape);
}
for (const entry of reviewCases.negative) {
  assert.ok(entry.expected_behavior.some((item) => /Do not invoke any DEKS tool/i.test(item)));
}
assert.ok(!reviewCases.positive.some(({ prompt }) => /upload_asset|attached file/i.test(prompt)));

const readOnly = ["list_icon_catalog", "recommend_palettes", "complete_palette", "list_presentations", "list_assets", "get_presentation", "render_slide_preview", "get_presentation_publication", "get_layout_snapshot", "get_slide_state", "validate_layout", "export_deck"];
const privateCreate = ["create_presentation", "upload_asset"];
const publicAdd = ["publish_presentation", "duplicate_slide", "create_slide", "create_element", "add_existing_element_state"];
const publicDestructive = ["set_presentation_palette", "delete_presentation", "rotate_presentation_publication", "unpublish_presentation", "reorder_slides", "delete_slide", "update_slide", "set_slide_narration", "clear_slide_narration", "update_element_state", "remove_element_from_slide", "update_element_identity", "delete_element", "set_presentation_motion_beat", "apply_commands", "set_motion", "clear_motion", "undo_transaction"];
const expected = new Map();
for (const name of readOnly) expected.set(name, [true, false, false]);
for (const name of privateCreate) expected.set(name, [false, false, false]);
for (const name of publicAdd) expected.set(name, [false, true, false]);
for (const name of publicDestructive) expected.set(name, [false, true, true]);
assert.equal(expected.size, 37, "canonical candidate must contain 37 tools");
assert.ok(!expected.has("rename_element"));
assert.ok([...expected.keys()].every((name) => !/_v[0-9]+$/.test(name)));

const rows = new Map();
for (const line of annotations.split("\n")) {
  const match = line.match(/^\| `([^`]+)` \| (true|false) \| (true|false) \| (true|false) \|/);
  if (match) rows.set(match[1], match.slice(2).map((value) => value === "true"));
}
assert.deepEqual(rows, expected, "annotation worksheet inventory or hints drifted");
assert.deepEqual(new Set(Object.keys(submission.tools)), new Set(expected.keys()), "submission JSON tool inventory drifted");
for (const [name, values] of expected) {
  const hints = submission.tools[name].annotations;
  assert.deepEqual([hints.readOnlyHint, hints.openWorldHint, hints.destructiveHint], values, `${name} hints drifted`);
}
assert.equal(submission.test_cases.length, 5);
assert.equal(submission.negative_test_cases.length, 3);
assert.equal(submission.app_info.subtitle.length <= 30, true);

for (const text of [cloudSkill, cloudTools]) {
  assert.match(text, /codec v3/i);
  assert.match(text, /set_slide_narration/);
  assert.match(text, /clear_slide_narration/);
  assert.match(text, /upload_asset[\s\S]{0,180}image-only/i);
  assert.doesNotMatch(text, /get_presentation_v[0-9]|get_slide_state_v[0-9]|create_element_v[0-9]|rename_element/);
}
assert.match(cloudTools, /parent_id/);
assert.match(cloudTools, /clear_parent/);
assert.match(cloudTools, /absolute canvas geometry/i);
assert.match(cloudTools, /primitive nodes/);
assert.match(cloudTools, /Lucide[\s\S]{0,100}1\.34\.0/i);

const candidateHashes = checksumMap(version);
assert.equal(candidateHashes.size, 5);
for (const [skill, expectedEntries] of skillEntries) {
  const path = `submission/openai-skills-v${version}/${skill}.zip`;
  const snapshot = readZip(path);
  assert.equal(sha256(snapshot.archive), candidateHashes.get(`${skill}.zip`), `${skill} hash drifted`);
  assert.deepEqual([...snapshot.entries.keys()].sort(), [...expectedEntries].sort(), `${skill} tree drifted`);
  for (const entry of expectedEntries) {
    assert.deepEqual(snapshot.entries.get(entry), file(`skills/${skill}/${entry}`), `${skill}:${entry} differs from live skill`);
  }
}

const evidenceHashes = checksumMap(evidenceVersion);
assert.equal(evidenceHashes.size, 5);
let packagedEvidenceCloud;
for (const [skill, expectedEntries] of skillEntries) {
  const path = `submission/openai-skills-v${evidenceVersion}/${skill}.zip`;
  const snapshot = readZip(path);
  assert.equal(sha256(snapshot.archive), evidenceHashes.get(`${skill}.zip`), `${skill} v${evidenceVersion} evidence hash drifted`);
  assert.deepEqual([...snapshot.entries.keys()].sort(), [...expectedEntries].sort(), `${skill} v${evidenceVersion} evidence tree drifted`);
  if (skill === "deks-cloud-mcp") packagedEvidenceCloud = snapshot.entries.get("references/tools.md").toString("utf8");
}
assert.match(packagedEvidenceCloud, /Asset upload,[^\n]*remain web-app or future-server workflows/i);
assert.match(finding, /portal version `v1\.0\.0`/);

for (const document of [listing, publicListing, portal, releaseNotes]) {
  assert.match(document, /https:\/\/deks\.eigen\.cl\//);
}
assert.match(portal, /37 scanned tools/);
assert.match(releaseNotes, /ChatGPT web and mobile/i);
assert.ok(listing.startsWith(`# OpenAI public submission — DEKS v${version} candidate`));
assert.ok(portal.startsWith(`# DEKS v${version} — portal copy sheet`));
assert.ok(releaseNotes.startsWith(`# DEKS v${version} — OpenAI public submission`));

const png = file("assets/deks-icon.png");
assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
assert.equal(png.readUInt32BE(16), 512);
assert.equal(png.readUInt32BE(20), 512);

const publicBundle = [listing, publicListing, portal, releaseNotes, JSON.stringify(reviewCases), JSON.stringify(submission)].join("\n");
for (const pattern of [/deks_pat_[A-Za-z0-9_-]{8,}/, /sk-[A-Za-z0-9_-]{20,}/, /Bearer\s+[A-Za-z0-9._-]{20,}/]) {
  assert.doesNotMatch(publicBundle, pattern, `submission bundle matches secret-like pattern ${pattern}`);
}

console.log("OpenAI candidate v0.4.0 valid: 37 canonical tools, 5+3 deterministic cases, five live ZIPs, and immutable v0.3.3 evidence verified.");
