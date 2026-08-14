# ChatGPT development setup

ChatGPT needs two separate pieces:

1. a registered OAuth connection to the remote DEKS MCP;
2. the optional local plugin package, which contributes the DEKS operational
   and presentation-design skills plus install metadata.

Do not paste a PAT into ChatGPT. The ChatGPT connection must complete DEKS
OAuth in the browser.

## Current development status

The DEKS MCP connection is registered in ChatGPT Developer mode, its OAuth flow
has completed successfully, and ChatGPT has scanned the current tool actions.
The combined package is ready for local marketplace installation and testing.

## 1. Register and test the MCP

Use ChatGPT web for registration:

1. Open **Settings → Security and login** and enable **Developer mode**.
2. Open [ChatGPT Plugins](https://chatgpt.com/plugins) and select **+**.
3. Name the connection `DEKS` and enter
   `https://api-deks.eigen.cl/mcp/` as its public MCP URL.
4. Create the connection and complete the DEKS OAuth consent flow.
5. Review the discovered tools and annotations.
6. Start a new conversation, add DEKS from the tools menu, and run the cases in
   `evals/prompts.jsonl`.

Developer mode availability depends on the account and workspace policy. The
documented registration surface is ChatGPT web; a local folder or GitHub URL is
not a substitute for registering the OAuth MCP connection.

## 2. Install the package in ChatGPT Desktop

The repository includes the ChatGPT/Codex marketplace at
`.agents/plugins/marketplace.json` and a legacy-compatible Claude marketplace.
ChatGPT Desktop can discover the former as a local or Git-backed marketplace.

For this private GitHub source, use the already-configured SSH access:

```bash
codex plugin marketplace add git@github.com:eigen-cl/deks-plugin.git --ref main
codex plugin marketplace list
```

Restart ChatGPT Desktop. Open **Plugins Directory**, select the `EIGEN Plugins`
source, and install `deks-plugin`.

For edits that have not been pushed, use the checkout as the marketplace:

```bash
codex plugin marketplace add /Users/felipepezoa/Projects/deks/deks-plugin
```

After changing the package, refresh or reinstall it and start a new
conversation; ChatGPT loads an installed cache copy, not the working directory
in place.

## 3. Join the package to the registered MCP

The DEKS connection is registered and the package maps its real technical ID in
`.app.json`:

```json
{
  "apps": {
    "deks": {
      "id": "plugin_asdk_app_6a7f1112a9a8819195c6a77ac011bfd5"
    }
  }
}
```

`.codex-plugin/plugin.json` points its `apps` field at this file. The technical
ID identifies the registered connection; it is not an access token. Never add
OAuth tokens, cookies, PATs, or browser session data to the package.

If the connection is recreated instead of refreshed, replace the mapping with
the new real `plugin_asdk_app...` ID, validate the package again, refresh the
marketplace, restart ChatGPT Desktop, and test in a new conversation. Never
invent this ID.

## Refresh after MCP changes

When tool names, schemas, annotations, authentication, or UI resources change:

1. deploy the MCP server change;
2. open its connection in ChatGPT Plugins;
3. select **Refresh** and review the new metadata;
4. start a new conversation and rerun affected evals.

Published plugins use a reviewed metadata snapshot, so a production update
requires a new scan and reviewed version.

## Official OpenAI documentation

- [Connect and test your plugin](https://developers.openai.com/plugins/deploy/connect-chatgpt)
- [Package your plugin](https://developers.openai.com/plugins/build/plugins)
- [Authentication](https://developers.openai.com/plugins/build/auth)
- [Submit plugins](https://developers.openai.com/plugins/deploy/submission)
