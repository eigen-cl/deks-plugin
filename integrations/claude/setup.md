# Claude integration

## Claude Code plugin

The distributed plugin uses OAuth. Its root `.mcp.json` intentionally contains
no shared token or static authorization header. The plugin installs disabled by
default because enabling it adds an external DEKS service; enable it deliberately,
reload plugins if requested, and run `/mcp` to authenticate in the browser.

### Install from the EIGEN marketplace

The public EIGEN source can be installed directly from GitHub:

```bash
claude plugin marketplace add eigen-cl/deks-plugin
claude plugin install deks-plugin@eigen-plugins
claude plugin enable deks-plugin@eigen-plugins
```

For a local checkout, run this from the plugin root instead:

```bash
claude plugin marketplace add ./
claude plugin install deks-plugin@eigen-plugins
claude plugin enable deks-plugin@eigen-plugins
```

Start Claude Code, run `/reload-plugins` if prompted, then run `/mcp` and
complete the DEKS OAuth flow.

### Future community marketplace installation

These commands become valid only after Anthropic approves DEKS and the plugin
appears in the public `claude-community` catalog:

```bash
claude plugin marketplace add anthropics/claude-plugins-community
claude plugin install deks-plugin@claude-community
claude plugin enable deks-plugin@claude-community
```

Submitting a third-party plugin does not add it to
`claude-plugins-official`; Anthropic curates that marketplace separately.

For development or a direct CLI connection only, set a workspace PAT in the shell and register a separate server name:

```bash
export DEKS_PAT="deks_pat_..."
claude mcp add --transport http --scope user deks-dev https://api-deks.eigen.cl/mcp/ \
  --header "Authorization: Bearer ${DEKS_PAT}"
```

Do not place the PAT in `.mcp.json`, shared settings, shell history, or this repository. Verify connections with `/mcp` or `claude mcp list`.

## Claude and Claude Desktop

Remote connectors must be added in **Settings → Connectors → Add custom connector**. Use `https://api-deks.eigen.cl/mcp/` and complete OAuth. Claude Desktop does not load remote connector URLs from `claude_desktop_config.json`.

The production connector supports OAuth. PAT authentication remains a development and direct-CLI compatibility path, not the public installation flow.

Current Anthropic guidance:

- https://code.claude.com/docs/en/mcp
- https://code.claude.com/docs/en/plugin-marketplaces
- https://code.claude.com/docs/en/plugins#submit-your-plugin-to-the-community-marketplace
