# DEKS plugin

Plugin de DEKS para ChatGPT, Codex y Claude. Separa dos responsabilidades:
`deks-presentations` opera el producto y sus herramientas con seguridad, mientras
`design-deks-presentations` aporta una metodología opinada para diseñar y auditar
historias visuales. Incluye además la conexión al MCP remoto de DEKS.

El MCP también puede listar assets del workspace, renderizar previews PNG de
checkpoints para QA, recomendar o completar paletas con contraste medido y
resolver íconos vectoriales offline por familia y semántica.

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

El repositorio no reemplaza el registro OAuth. La conexión DEKS ya registrada
en ChatGPT está asociada al paquete mediante `.app.json`; el login y el
consentimiento siguen ocurriendo con OAuth en el navegador.

## Otras integraciones

- [Codex](integrations/codex/setup.md)
- [Claude](integrations/claude/setup.md)

## Contenido

- `.codex-plugin/plugin.json`: manifiesto para ChatGPT y Codex.
- `.app.json`: asociación con la conexión MCP registrada en ChatGPT; no contiene
  tokens ni credenciales.
- `.agents/plugins/marketplace.json`: catálogo para instalar este checkout o el
  repositorio desde ChatGPT Desktop y Codex.
- `.claude-plugin/`: manifiesto y marketplace compatible con Claude Code y con
  el formato legacy del catálogo local de ChatGPT Desktop.
- `.mcp.json`: conexión remota sin secretos.
- `assets/deks-icon.png`: icono oficial DEKS, PNG opaco de 512 × 512 px sobre Ink con clearspace interior para superficies de app.
- `skills/deks-presentations/`: contrato operativo y seguro del producto DEKS.
- `skills/design-deks-presentations/`: método de narrativa, diseño, movimiento y QA.
- `evals/prompts.jsonl`: casos positivos, negativos y destructivos.
- `submission/`: material de preparación para una futura publicación pública.

## Estado de publicación

Este repositorio es una fuente privada de desarrollo. No está publicado todavía
en el directorio universal de plugins. La publicación pública requiere una
revisión separada y no ocurre al empujar `main`.
