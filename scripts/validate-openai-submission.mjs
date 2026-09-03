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

const version = "0.4.1";
const evidenceChecksums = new Map([
  ["0.3.3", new Map([
    ["deks-cloud-mcp.zip", "1aa9e0ff531dd9f0edac846fe66b784a931561474aed021a69877b431b0b8811"],
    ["deks-desktop-mcp.zip", "4e939ebce697ab7441c169d0f5ecc5c786346a8707a45a4dd20175290c434a22"],
    ["deks-motion-patterns.zip", "3d9f76708331f4f9830efcdce29985ded8a27b91f6d8731205d9beb67dea915d"],
    ["deks-presentations.zip", "3e4fa4ab5349460bce79384031e71679aaaee04f42f86abfdd9ca8b5f435e64d"],
    ["design-deks-presentations.zip", "723a24554033405498750b7d44f43e4e7867179d02e23e4698601777b07990a2"],
  ])],
  ["0.4.0", new Map([
    ["deks-cloud-mcp.zip", "ca5d28768806f773a578cfe9613f16a586c9561bcad5cedbf0d590130e93569d"],
    ["deks-desktop-mcp.zip", "0422fbecb627b2433d4d772c714c583c843634bbce821b7435443335d24766ff"],
    ["deks-motion-patterns.zip", "6418274c2fbe5ae9b4c9a736356e5553cea26ce07821cb611bf11273578773c4"],
    ["deks-presentations.zip", "8ee65ccdc914579da3f953c5d51d19a74e866f864817cdb87814ccbe721e4ed9"],
    ["design-deks-presentations.zip", "d147ec1bd5af17cc45b9b17df374876e62d76cafd06158a8b4fc9f4d51933347"],
  ])],
]);
const immutableV040Files = new Map([
  ["submission/openai-listing-v0.4.0.md", "a0dfd6aa12e42da2f05b068027106c7399e80fa9eafbc802c177fc872cbe546b"],
  ["submission/openai-portal-draft-v0.4.0.md", "9b69b4686aad3358a46310994fcda24f066c0a755b6fd13d3e6a7fc3835f3060"],
  ["submission/openai-review-cases-v0.4.0.json", "31676e0584064bf062368a4088295a0a9861c0fcff84ef865ec468dbaac3bb68"],
  ["submission/openai-tool-annotations-v0.4.0.md", "ffe3b5921fefdea7ed09bdd50aa7dc36f9d6dd2c07515c72bca4f1805fbb0125"],
  ["submission/release-notes-v0.4.0.md", "6f155068d41de7370db1e2b33b4916414ac70423aea084ce49cc7cdf2b2da7f5"],
  ["submission/openai-skills-v0.4.0/SHA256SUMS", "147083c7b38dbc05e6b80a2d028833919e5b09d364707fa9ef05137f09d62e18"],
]);
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
  assert.ok(entry.expected_result_shape);
  if (entry.expected_result_shape.type !== "interactive_confirmation_card") {
    assert.match(entry.prompt, /End with exactly/i);
    assert.match(entry.prompt, /End with exactly[^\n]*\n[^\n]+:\n/);
    assert.doesNotMatch(entry.prompt, /labeled lines:[^\n]*;/);
  }
}
for (const entry of reviewCases.negative) {
  assert.ok(entry.expected_behavior.some((item) => /Do not invoke any DEKS tool/i.test(item)));
}
const negativeDelete = sourceById.get("negative-ambiguous-delete-target");
assert.match(negativeDelete.prompt, /either “Reviewer — Test A” or “Reviewer — Test B”/i);
assert.match(negativeDelete.prompt, /have not chosen one exact target/i);
assert.match(negativeDelete.prompt, /do not inspect or modify my workspace/i);
assert.ok(negativeDelete.expected_behavior.some((item) => /Do not invoke any DEKS tool, including list_presentations or delete_presentation/i.test(item)));
const positiveDelete = sourceById.get("positive-human-confirmed-delete-presentation");
assert.match(positiveDelete.prompt, /prepare permanent deletion for exactly the presentation “Reviewer — Promotion”/i);
assert.match(positiveDelete.prompt, /cannot be undone/i);
assert.match(positiveDelete.prompt, /still exists before I act/i);
assert.match(positiveDelete.prompt, /click “Delete permanently”/i);
assert.ok(positiveDelete.expected_behavior.some((item) => /delete_presentation exactly once to prepare confirmation/i.test(item)));
assert.ok(positiveDelete.expected_behavior.some((item) => /does not delete the presentation/i.test(item)));
assert.ok(positiveDelete.expected_behavior.some((item) => /app-only confirm_delete_presentation once/i.test(item)));
assert.equal(positiveDelete.expected_result_shape.before_human_confirmation, "Reviewer — Promotion remains present and the card offers Delete permanently.");
assert.equal(positiveDelete.expected_result_shape.after_human_confirmation, "Presentation deleted.");
assert.ok(!reviewCases.positive.some(({ prompt }) => /upload_asset|attached file/i.test(prompt)));

const readOnly = ["list_icon_catalog", "recommend_palettes", "complete_palette", "list_presentations", "list_assets", "get_presentation", "render_slide_preview", "get_presentation_publication", "get_layout_snapshot", "get_slide_state", "validate_layout", "export_deck", "delete_presentation"];
const privateCreate = ["create_presentation", "upload_asset"];
const publicAdd = ["publish_presentation", "duplicate_slide", "create_slide", "create_element", "add_existing_element_state"];
const publicDestructive = ["confirm_delete_presentation", "set_presentation_palette", "rotate_presentation_publication", "unpublish_presentation", "reorder_slides", "delete_slide", "update_slide", "set_slide_narration", "clear_slide_narration", "update_element_state", "remove_element_from_slide", "update_element_identity", "delete_element", "set_presentation_motion_beat", "apply_commands", "set_motion", "clear_motion", "undo_transaction"];
const expected = new Map();
for (const name of readOnly) expected.set(name, [true, false, false]);
for (const name of privateCreate) expected.set(name, [false, false, false]);
for (const name of publicAdd) expected.set(name, [false, true, false]);
for (const name of publicDestructive) expected.set(name, [false, true, true]);
assert.equal(expected.size, 38, "canonical candidate must contain 38 tool descriptors");
assert.ok(!expected.has("rename_element"));
assert.ok([...expected.keys()].every((name) => !/_v[0-9]+$/.test(name)));
const modelVisible = new Set([...expected.keys()].filter((name) => name !== "confirm_delete_presentation"));
assert.equal(modelVisible.size, 37, "canonical candidate must contain 37 model-visible tools");

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
assert.equal(submission.tools.delete_presentation.annotations.idempotentHint, true);
assert.equal(submission.tools.confirm_delete_presentation.annotations.idempotentHint, false);
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
assert.match(cloudSkill, /delete_presentation[\s\S]{0,180}prepares a confirmation card but cannot delete/i);
assert.match(cloudSkill, /confirm_delete_presentation[\s\S]{0,180}app-only/i);
assert.match(cloudTools, /ui:\/\/deks\/confirm-presentation-deletion-v3\.html/);
assert.match(cloudTools, /unique `confirmationId`/i);
assert.match(cloudTools, /card remains disabled if those IDs do not match/i);
assert.match(cloudTools, /signed, expiring confirmation token[\s\S]{0,180}result `_meta`/i);
assert.match(cloudTools, /confirm_delete_presentation\(confirmation_token\)[\s\S]{0,180}app-only\/private/i);
assert.match(cloudTools, /do not call any DEKS tool—not even `list_presentations`/i);
assert.match(annotations, /Raw MCP discovery contains 38 descriptors/i);
assert.match(annotations, /model-visible surface contains 37 tools/i);
assert.match(annotations, /idempotentHint: false/i);
assert.match(portal, /ui:\/\/deks\/confirm-presentation-deletion-v3\.html/);
assert.match(portal, /unique `confirmationId`/i);
assert.match(portal, /UI domain: `https:\/\/api-deks\.eigen\.cl`/i);
assert.match(portal, /connectDomains: \[\]`, `resourceDomains: \[\]/i);
assert.match(portal, /ui\.prefersBorder: true/i);
assert.match(portal, /openai\/widgetDomain/i);
assert.match(portal, /openai\/widgetAccessible: true/i);
assert.match(portal, /38 scanned descriptors/i);
assert.match(portal, /model-visible[\s\S]{0,80}37 tools/i);
assert.match(portal, /ui\.visibility: \["app"\]/i);
assert.match(portal, /openai\/visibility: "private"/i);
assert.match(releaseNotes, /inline human confirmation card/i);

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

let packagedEvidenceCloud;
for (const [evidenceVersion, pinnedHashes] of evidenceChecksums) {
  const evidenceHashes = checksumMap(evidenceVersion);
  assert.deepEqual(evidenceHashes, pinnedHashes, `v${evidenceVersion} SHA256SUMS evidence drifted`);
  for (const [skill, expectedEntries] of skillEntries) {
    const path = `submission/openai-skills-v${evidenceVersion}/${skill}.zip`;
    const snapshot = readZip(path);
    assert.equal(sha256(snapshot.archive), pinnedHashes.get(`${skill}.zip`), `${skill} v${evidenceVersion} evidence hash drifted`);
    assert.deepEqual([...snapshot.entries.keys()].sort(), [...expectedEntries].sort(), `${skill} v${evidenceVersion} evidence tree drifted`);
    if (evidenceVersion === "0.3.3" && skill === "deks-cloud-mcp") packagedEvidenceCloud = snapshot.entries.get("references/tools.md").toString("utf8");
  }
}
for (const [path, expectedHash] of immutableV040Files) {
  assert.equal(sha256(file(path)), expectedHash, `${path} immutable evidence drifted`);
}
assert.match(packagedEvidenceCloud, /Asset upload,[^\n]*remain web-app or future-server workflows/i);
assert.match(finding, /portal version `v1\.0\.0`/);

for (const document of [listing, publicListing, portal, releaseNotes]) {
  assert.match(document, /https:\/\/deks\.eigen\.cl\//);
}
assert.match(portal, /38 scanned descriptors/);
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

console.log("OpenAI candidate v0.4.1 valid: 38 descriptors, 37 model-visible tools, 5+3 deterministic cases, five live ZIPs, and immutable v0.3.3/v0.4.0 evidence verified.");
