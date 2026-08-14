# DEKS plugin

Plugin de DEKS para ChatGPT, Codex y Claude. Incluye una skill para crear,
editar, animar, validar y exportar presentaciones, además de la conexión al MCP
remoto de DEKS.

El endpoint canónico es:

```text
https://api-deks.eigen.cl/mcp/
```

Las instalaciones compartidas usan OAuth. Nunca agregues un PAT al repositorio,
a `.mcp.json` ni a una conversación. `DEKS_PAT` existe sólo para conexiones CLI
de desarrollo configuradas de forma explícita.

## Probar en ChatGPT

La conexión MCP se registra desde ChatGPT web en Developer mode. Después puede
usarse desde una conversación y combinarse con el paquete local en ChatGPT
Desktop. Sigue [integrations/chatgpt/setup.md](integrations/chatgpt/setup.md).

El repositorio no reemplaza el registro OAuth: ChatGPT debe crear primero la
conexión y entregar su ID técnico real. Hasta que ese ID exista, el paquete
omite `.app.json` intencionalmente.

## Otras integraciones

- [Codex](integrations/codex/setup.md)
- [Claude](integrations/claude/setup.md)

## Contenido

- `.codex-plugin/plugin.json`: manifiesto para ChatGPT y Codex.
- `.agents/plugins/marketplace.json`: catálogo para instalar este checkout o el
  repositorio desde ChatGPT Desktop y Codex.
- `.claude-plugin/`: manifiesto y marketplace compatible con Claude Code y con
  el formato legacy del catálogo local de ChatGPT Desktop.
- `.mcp.json`: conexión remota sin secretos.
- `skills/deks-presentations/`: workflow compartido para agentes.
- `evals/prompts.jsonl`: casos positivos, negativos y destructivos.
- `submission/`: material de preparación para una futura publicación pública.

## Estado de publicación

Este repositorio es una fuente privada de desarrollo. No está publicado todavía
en el directorio universal de plugins. La publicación pública requiere una
revisión separada y no ocurre al empujar `main`.
