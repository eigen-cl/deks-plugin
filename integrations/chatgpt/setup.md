# ChatGPT development setup

ChatGPT needs two separate pieces:

1. a registered OAuth connection to the remote DEKS MCP;
2. the optional local plugin package, which contributes the DEKS skill and
   install metadata.

Do not paste a PAT into ChatGPT. The ChatGPT connection must complete DEKS
OAuth in the browser.

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

After ChatGPT creates the DEKS connection, copy the technical ID from its
browser URL. It starts with `plugin_asdk_app`.

Create `.app.json` only with that real ID:

```json
{
  "apps": {
    "deks": {
      "id": "plugin_asdk_app_REPLACE_WITH_REAL_ID",
      "required": true
    }
  }
}
```

Then add `"apps": "./.app.json"` to `.codex-plugin/plugin.json`, validate the
package again, refresh the marketplace, restart ChatGPT Desktop, and test in a
new conversation. Do not invent this ID or commit credentials. Decide whether
the technical ID is environment-specific before committing it.

Until this mapping exists, test the OAuth MCP connection in ChatGPT and the
bundled skill/package as separate development surfaces.

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
