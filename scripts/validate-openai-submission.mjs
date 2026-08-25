import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");
const json = (path) => JSON.parse(read(path));

const version = "0.3.3";
const manifest = json(".codex-plugin/plugin.json");
const claudeManifest = json(".claude-plugin/plugin.json");
const claudeMarketplace = json(".claude-plugin/marketplace.json");
const mcp = json(".mcp.json");
const reviewCases = json(`submission/openai-review-cases-v${version}.json`);
const listing = read("submission/openai-listing.md");
const portal = read(`submission/openai-portal-draft-v${version}.md`);
const releaseNotes = read(`submission/release-notes-v${version}.md`);
const annotationWorksheet = read(`submission/openai-tool-annotations-v${version}.md`);
const presentationContractSkill = read("skills/deks-presentations/SKILL.md");
const presentationDesignSkill = read("skills/design-deks-presentations/SKILL.md");
const cloudMcpSkill = read("skills/deks-cloud-mcp/SKILL.md");
const desktopMcpSkill = read("skills/deks-desktop-mcp/SKILL.md");
const evals = read("evals/prompts.jsonl")
  .split("\n")
  .filter(Boolean)
  .map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`evals/prompts.jsonl:${index + 1}: ${error.message}`);
    }
  });

assert.equal(manifest.version, version, "manifest version must match the submission");
assert.equal(claudeManifest.version, version, "Claude manifest version must match the submission");
assert.equal(
  claudeMarketplace.plugins.find(({ name }) => name === "deks-plugin")?.version,
  version,
  "Claude marketplace version must match the submission",
);
assert.equal(reviewCases.version, version, "review case version must match the submission");
assert.equal(reviewCases.source, "evals/prompts.jsonl");
assert.equal(mcp.mcpServers.deks.url, "https://api-deks.eigen.cl/mcp/");

assert.ok(manifest.interface, "manifest interface metadata is required");
assert.ok(
  manifest.interface.shortDescription.length <= 30,
  `interface.shortDescription must be at most 30 characters, got ${manifest.interface.shortDescription.length}`,
);
assert.equal(manifest.interface.shortDescription, "Decks for people and AI agents");
assert.equal(manifest.interface.websiteURL, "https://deks.eigen.cl/");
assert.equal(manifest.interface.supportURL, "https://deks.eigen.cl/support/");
assert.equal(manifest.interface.privacyPolicyURL, "https://deks.eigen.cl/privacy/");
assert.equal(manifest.interface.termsOfServiceURL, "https://deks.eigen.cl/terms/");
for (const description of [manifest.description, claudeManifest.description]) {
  assert.equal(
    description,
    "Create and keep editing shared, animated presentations with people and AI agents.",
  );
}
assert.equal(
  claudeMarketplace.plugins.find(({ name }) => name === "deks-plugin")?.description,
  manifest.description,
  "public manifest descriptions must stay aligned",
);

const skillNames = [
  "deks-presentations",
  "deks-cloud-mcp",
  "deks-desktop-mcp",
  "design-deks-presentations",
  "deks-motion-patterns",
];
for (const skillName of skillNames) {
  assert.ok(
    statSync(join(root, "skills", skillName, "SKILL.md")).isFile(),
    `missing skill: ${skillName}`,
  );
}

const sourceById = new Map();
for (const entry of evals) {
  assert.ok(entry.id, "every eval needs an id");
  assert.ok(!sourceById.has(entry.id), `duplicate eval id: ${entry.id}`);
  sourceById.set(entry.id, entry);
}
assert.equal(evals.filter(({ kind }) => kind === "positive").length, 22);
assert.equal(evals.filter(({ kind }) => kind === "negative").length, 14);

const attachedAssetCase = sourceById.get("positive-upload-attached-logo");
assert.ok(attachedAssetCase, "attached asset upload regression case is required");
assert.equal(attachedAssetCase.kind, "positive");
for (const requirement of [/upload_asset/i, /attached/i, /asset_id/i]) {
  assert.ok(
    attachedAssetCase.expected_behavior.some((behavior) => requirement.test(behavior)),
    `attached asset upload regression is missing ${requirement}`,
  );
}

const unattachedPathCase = sourceById.get("negative-unattached-local-path");
assert.ok(unattachedPathCase, "unattached local path regression case is required");
assert.equal(unattachedPathCase.kind, "negative");
assert.match(unattachedPathCase.prompt, /local path|\/Users\//i);
for (const requirement of [/do not call upload_asset/i, /attach/i, /do not invent/i]) {
  assert.ok(
    unattachedPathCase.expected_behavior.some((behavior) => requirement.test(behavior)),
    `unattached local path regression is missing ${requirement}`,
  );
}

for (const [name, document] of [
  ["deks-cloud-mcp", cloudMcpSkill],
  ["Cloud tool map", read("skills/deks-cloud-mcp/references/tools.md")],
  ["design visual system", read("skills/design-deks-presentations/references/visual-system.md")],
]) {
  assert.match(document, /upload_asset/i, `${name} must document upload_asset`);
  assert.match(
    document,
    /explicitly attached|explicit attachment/i,
    `${name} must require an explicit attachment`,
  );
  assert.match(document, /asset_id/i, `${name} must require reuse of the returned asset_id`);
  assert.match(
    document,
    /do not invent|never invent/i,
    `${name} must reject invented files, paths, or URLs`,
  );
}

const textIdentityCase = sourceById.get("negative-reuse-text-identity-for-new-copy");
assert.ok(textIdentityCase, "text identity regression case is required");
assert.equal(textIdentityCase.kind, "negative");
assert.ok(
  textIdentityCase.expected_behavior.some((behavior) =>
    /new text identity/i.test(behavior)
  ),
  "text identity regression must require a new identity",
);
for (const [name, skill] of [
  ["deks-presentations", presentationContractSkill],
  ["design-deks-presentations", presentationDesignSkill],
]) {
  assert.match(
    skill,
    /same (?:phrase|text content|string)[\s\S]{0,120}same identity/i,
    `${name} must state when a text identity continues`,
  );
  assert.match(
    skill,
    /new (?:phrase|claim|label)[\s\S]{0,120}new identity/i,
    `${name} must state when replacement copy needs a new identity`,
  );
}

const lowLatencyCase = sourceById.get("positive-low-latency-coherent-batching");
assert.ok(lowLatencyCase, "low-latency batching regression case is required");
assert.equal(lowLatencyCase.kind, "positive");
for (const requirement of [
  /apply_commands/i,
  /expected_revision/i,
  /idempotency/i,
  /checkpoint|narration/i,
  /not after each property|rather than after each property/i,
]) {
  assert.ok(
    lowLatencyCase.expected_behavior.some((behavior) => requirement.test(behavior)),
    `low-latency batching regression is missing ${requirement}`,
  );
}
for (const [name, skill] of [
  ["deks-cloud-mcp", cloudMcpSkill],
  ["deks-desktop-mcp", desktopMcpSkill],
]) {
  assert.match(
    skill,
    /apply_commands[\s\S]{0,240}coherent/i,
    `${name} must prefer coherent apply_commands batches`,
  );
  assert.match(
    skill,
    /render[\s\S]{0,180}(?:checkpoint|narration)[\s\S]{0,180}(?:property|properties)/i,
    `${name} must render coherent checkpoints instead of individual properties`,
  );
}

assert.equal(reviewCases.positive.length, 5, "OpenAI requires five positive cases");
assert.equal(reviewCases.negative.length, 3, "OpenAI requires three negative cases");

const selected = [...reviewCases.positive, ...reviewCases.negative];
assert.equal(new Set(selected.map(({ id }) => id)).size, 8, "review case IDs must be unique");

for (const entry of reviewCases.positive) {
  assert.equal(entry.kind, "positive", `${entry.id} must be positive`);
  assert.ok(entry.prompt && entry.fixture);
  assert.ok(Array.isArray(entry.expected_behavior) && entry.expected_behavior.length > 0);
  assert.ok(entry.expected_result_shape, `${entry.id} needs an expected result shape`);
}

for (const entry of reviewCases.negative) {
  assert.equal(entry.kind, "negative", `${entry.id} must be negative`);
  assert.ok(entry.prompt && entry.fixture && entry.why);
  assert.ok(Array.isArray(entry.expected_behavior) && entry.expected_behavior.length > 0);
}

for (const entry of selected) {
  assert.ok(sourceById.has(entry.id), `selected case not found in evals: ${entry.id}`);
  assert.deepEqual(entry, sourceById.get(entry.id), `${entry.id} must be copied exactly from evals`);
  assert.ok(listing.includes(`\`${entry.id}\``), `${entry.id} missing from listing`);
}
assert.ok(
  reviewCases.positive.some(({ id }) => id === "positive-upload-attached-logo"),
  "review cases must exercise an explicitly attached asset upload",
);
assert.ok(
  reviewCases.negative.some(({ id }) => id === "negative-unattached-local-path"),
  "review cases must reject an unattached local path",
);

for (const document of [listing, portal]) {
  assert.ok(document.includes("Decks for people and AI agents"));
  assert.ok(document.includes("https://deks.eigen.cl/"));
  assert.ok(document.includes("https://deks.eigen.cl/support/"));
  assert.ok(document.includes("https://deks.eigen.cl/privacy/"));
  assert.ok(document.includes("https://deks.eigen.cl/terms/"));
  assert.ok(document.includes("https://api-deks.eigen.cl/mcp/"));
}

assert.ok(listing.startsWith(`# OpenAI public submission — DEKS v${version} candidate`));
assert.ok(portal.startsWith(`# DEKS v${version} — portal copy sheet`));
assert.ok(releaseNotes.startsWith(`# DEKS v${version} — OpenAI public submission`));
assert.match(releaseNotes, /public submission(?: update)?/);

const readOnlyTools = [
  "list_icon_catalog",
  "recommend_palettes",
  "complete_palette",
  "list_presentations",
  "list_assets",
  "get_presentation",
  "render_slide_preview",
  "get_presentation_publication",
  "get_layout_snapshot",
  "get_slide_state",
  "validate_layout",
  "export_deck",
];
const additivePublicTools = [
  "publish_presentation",
  "duplicate_slide",
  "create_slide",
  "create_element",
  "add_existing_element_state",
];
const overwritingPublicTools = [
  "set_presentation_palette",
  "reorder_slides",
  "update_slide",
  "update_element_state",
  "rename_element",
  "set_presentation_motion_beat",
  "set_motion",
  "clear_motion",
  "undo_transaction",
];
const destructivePublicTools = [
  "delete_presentation",
  "rotate_presentation_publication",
  "unpublish_presentation",
  "delete_slide",
  "remove_element_from_slide",
  "delete_element",
  "apply_commands",
];
const expectedAnnotations = new Map();
for (const name of readOnlyTools) expectedAnnotations.set(name, [true, false, false]);
expectedAnnotations.set("create_presentation", [false, false, false]);
expectedAnnotations.set("upload_asset", [false, false, false]);
for (const name of additivePublicTools) expectedAnnotations.set(name, [false, true, false]);
for (const name of overwritingPublicTools) expectedAnnotations.set(name, [false, true, true]);
for (const name of destructivePublicTools) expectedAnnotations.set(name, [false, true, true]);

const annotationRows = new Map();
for (const line of annotationWorksheet.split("\n")) {
  const match = line.match(/^\| `([^`]+)` \| (true|false) \| (true|false) \| (true|false) \|/);
  if (!match) continue;
  const [, name, readOnly, openWorld, destructive] = match;
  assert.ok(!annotationRows.has(name), `duplicate annotation row: ${name}`);
  annotationRows.set(name, [readOnly === "true", openWorld === "true", destructive === "true"]);
}
assert.equal(annotationRows.size, 35, `annotation worksheet must cover all 35 v${version} tools`);
assert.deepEqual(annotationRows, expectedAnnotations, "annotation worksheet values or tool inventory drifted");
assert.ok(portal.includes(`openai-tool-annotations-v${version}.md`));

const png = readFileSync(join(root, "assets/deks-icon.png"));
assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
assert.equal(png.readUInt32BE(16), 512, "logo width must be 512 px");
assert.equal(png.readUInt32BE(20), 512, "logo height must be 512 px");

const publicBundle = [listing, portal, releaseNotes, JSON.stringify(reviewCases)].join("\n");
assert.doesNotMatch(publicBundle, /cannot upload (?:new files|a new asset)|does not upload assets/i);
const secretPatterns = [
  /deks_pat_[A-Za-z0-9_-]{8,}/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /Bearer\s+[A-Za-z0-9._-]{20,}/,
];
for (const pattern of secretPatterns) {
  assert.ok(!pattern.test(publicBundle), `submission bundle matches secret-like pattern ${pattern}`);
}

console.log(
  `OpenAI submission bundle v${version} valid: 5 positive cases, 3 negative cases, 5 skills, 512 px logo.`,
);
