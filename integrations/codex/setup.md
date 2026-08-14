# Codex integration

## Install the complete plugin from GitHub

The repository includes `.agents/plugins/marketplace.json` for the local plugin
marketplace used by Codex and ChatGPT Desktop.

```bash
codex plugin marketplace add git@github.com:eigen-cl/deks-plugin.git --ref main
codex plugin marketplace list
```

Restart ChatGPT Desktop, open **Plugins Directory**, select `EIGEN Plugins`, and
install `deks-plugin`. A private repository requires working local SSH access
to GitHub.

For an unpublished checkout:

```bash
codex plugin marketplace add /Users/felipepezoa/Projects/deks/deks-plugin
```

Codex installs a cached copy. After changing the source, refresh or reinstall
the plugin, restart the app, and test in a new conversation.

## Connect only the MCP

The distributed MCP configuration contains no token. It uses the remote DEKS
OAuth flow when the host supports it.

For an intentional direct CLI development connection using a workspace PAT,
keep the token only in the environment:

```bash
export DEKS_PAT="deks_pat_..."
codex mcp add deks-dev \
  --url https://api-deks.eigen.cl/mcp/ \
  --bearer-token-env-var DEKS_PAT
codex mcp get deks-dev
```

Never add the PAT to `.mcp.json`, a marketplace manifest, Git, or chat output.

## ChatGPT MCP mapping

The complete ChatGPT package also needs the real `plugin_asdk_app...` ID created
when the MCP is registered in ChatGPT Developer mode. See
`integrations/chatgpt/setup.md`. The repository intentionally omits `.app.json`
until that ID exists.
