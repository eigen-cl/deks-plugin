# DEKS plugin

Plugin de DEKS para ChatGPT, Codex y Claude. Separa cinco responsabilidades para
que ninguna skill mezcle el contrato del documento con las herramientas de un
host concreto:

- `deks-presentations`: el contrato del documento DEKS, independiente del host.
- `deks-cloud-mcp`: cómo operar el MCP remoto de un workspace.
- `deks-desktop-mcp`: cómo operar el MCP local sobre archivos `.deks` del disco.
- `design-deks-presentations`: el método para construir la presentación.
- `deks-motion-patterns`: coreografías reutilizables, listas para aplicar.

Incluye además la conexión al MCP remoto de DEKS.

El MCP también puede listar assets del workspace, admitir archivos adjuntos
explícitos, renderizar previews PNG de
checkpoints para QA, recomendar o completar paletas con contraste medido y
resolver por semántica y páginas el catálogo completo de íconos Lucide 1.34.0,
incluido offline como geometría vectorial segura.

El contrato portable ahora emite codec v3. Los documentos sin versión, con v1 o
con v2 migran mediante el mismo decoder secuencial antes de editarse. En texto v2+,
contenido, fuente, alineaciones y overflow viven en la identidad; la tipografía
continua y el padding exacto por cuatro lados siguen animables por slide.

Codec v3 agrega una narración opcional por slide: guion, pausa anterior/posterior
y una toma WAV o MP3 incrustada por hash dentro del mismo `.deks`. Desktop, Web
y Cloud conservan ese contrato; el MCP Cloud permite definir o limpiar el guion,
las pausas y una referencia a audio ya admitido. `upload_asset` sigue aceptando
solamente imágenes: no carga audio de narración. La voz, el proveedor, créditos
y consentimientos Cloud nunca forman parte del archivo portable.

Los elementos pueden organizarse en grupos lógicos con `parentId` sin alterar
sus coordenadas absolutas. El MCP Cloud usa una superficie canónica sin nombres
versionados: `get_presentation`, `get_slide_state`, `create_element`,
`update_element_identity` y `list_icon_catalog` trabajan directamente con Core 6.

Web, Cloud y Desktop comparten el mismo contrato de imagen: PNG, JPEG, GIF y
WebP de hasta 50 MB, más un perfil SVG estático seguro de hasta 5 MB. El archivo
portable `.deks` incrusta los bytes canónicos de esos assets para abrir la misma
presentación en cualquiera de los tres hosts.

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
- `skills/deks-presentations/`: modelo del documento, contrato de movimiento,
  invariantes de validación y recuperación de escrituras inciertas.
- `skills/deks-cloud-mcp/`: mapa de herramientas, revisiones, cuotas y errores
  del MCP remoto.
- `skills/deks-desktop-mcp/`: las cinco herramientas locales, el envoltorio de
  comandos de Core y lo que no existe fuera de Cloud.
- `skills/design-deks-presentations/`: método de narrativa, diseño, movimiento y QA.
- `skills/deks-motion-patterns/`: catálogo de patrones de animación con comandos.
- `evals/prompts.jsonl`: casos positivos, negativos y destructivos.
- `submission/`: material de preparación para publicaciones públicas, incluido
  el dossier de revisión del marketplace oficial de Claude y el bundle copiable
  para el portal público de OpenAI.
- `CHANGELOG.md`: cambios visibles y contractuales por versión.
- `LICENSE`: licencia Apache-2.0 del paquete público.

## Validar el bundle de OpenAI

Este repositorio no tiene dependencias de runtime ni un entorno Docker propio.
La validación del bundle usa solamente Node.js y comprueba la versión, metadata,
URLs, cinco skills, icono de 512 px y que los cinco casos positivos y tres
negativos sean copias exactas de `evals/prompts.jsonl`:

```bash
node scripts/validate-openai-submission.mjs
claude plugin validate . --strict
git diff --check
```

El workflow `.github/workflows/validate.yml` ejecuta estas comprobaciones en
push y pull request. En CI instala de forma efímera y reproducible el paquete
oficial `@anthropic-ai/claude-code@2.1.226`; no requiere login ni credenciales.

El validador abre los cinco ZIP del candidato OpenAI 0.4.0, comprueba sus hashes
y árboles contra las skills vivas, y conserva por separado los cinco ZIP 0.3.3
como evidencia inmutable del rechazo anterior.

## Estado de publicación

Este repositorio es la fuente pública de distribución independiente. DEKS aún no
está listado en `claude-plugins-official`: esa publicación requiere postularlo
mediante el formulario autenticado de Anthropic y no ocurre al empujar `main`.
La asociación técnica de OpenAI sirve para Developer mode; la publicación
universal también requiere crear el draft, pasar revisión y elegir Publish en el
portal de OpenAI.
