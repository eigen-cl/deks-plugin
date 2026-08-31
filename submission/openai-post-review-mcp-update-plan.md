# DEKS Cloud MCP — update posterior al review de ChatGPT

Estado del plan: preparado el 29 de agosto de 2026. No autoriza cancelar,
publicar, apelar, reenviar ni modificar el review activo.

Referencia normativa: [How published MCP metadata versions work](https://developers.openai.com/plugins/deploy/app-review#how-published-mcp-metadata-versions-work).

## Decisión de release

Mantener congelado el candidato `deks-plugin` 0.3.3 que el usuario reporta en
review. Los cambios de Core 6, narración, grupos, Web y el contrato Cloud siguiente
se preparan aparte. No se cancela el review para incorporarlos.

El siguiente update de ChatGPT debe conservar íntegramente las herramientas y
schemas del snapshot publicado, desplegar primero un MCP vivo compatible y recién
entonces ejecutar un nuevo **Scan Tools**, revisar el snapshot guardado y enviarlo
a review.

## Cuatro estados que no deben confundirse

| Estado | Evidencia actual | Confianza |
|---|---|---|
| Snapshot publicado en ChatGPT | El portal no fue inspeccionado en esta auditoría. La versión exacta visible para usuarios sigue pendiente de verificación segura. | Desconocido |
| Snapshot enviado a review | El usuario confirma que la última versión desplegada está en review. El bundle del repo, el tag y los formularios apuntan a `deks-plugin` 0.3.3 y 35 herramientas Cloud. | Estado user-reported; versión inferida del repo, no del portal |
| MCP vivo | `https://api-deks.eigen.cl/mcp/` responde y exige token MCP. Heroku release v55 desplegó el source `a0429fd1`, tag API `v0.9.6`, el 25 de agosto; `heroku/main` y `origin/main` coinciden. El workflow GitHub de ese tag falló antes de ejecutar steps, así que ese SHA no tiene CI verde. | Source desplegado verificado; metadata guardada por el portal no verificada |
| Próxima versión local | Core 6.0.0 y Desktop 0.12.0 ya fueron liberados. API, Web y Plugin mantienen el trabajo no publicado en branches locales `release-after-plugin-review`. | Verificado en los checkouts |

Antes de cualquier release se debe confirmar en el portal, sin leer credenciales:
la versión publicada, la versión en review, la fecha del scan y el estado exacto.

Los cinco ZIP bajo `submission/openai-skills-v0.3.3/` coinciden con las skills del
tag 0.3.3, pero no con todas las skills vivas del worktree. Además, el worksheet
`openai-tool-annotations-v0.3.3.md` fue editado localmente para el contrato siguiente.
Antes de preparar 0.4.0 se debe restaurar todo artifact 0.3.3 desde el tag, conservarlo
como evidencia inmutable y mover cada cambio posterior a archivos nuevos 0.4.0.

## Cambios que formarán el próximo update

| Cambio | Owner | Impacto en contrato publicado | Compatibilidad requerida | ¿Nuevo review? | Momento de deploy |
|---|---|---|---|---|---|
| Grupos lógicos con `parentId`, carpetas y posiciones absolutas | Core define; API persiste; Web presenta | Nuevos campos/operaciones en inputs y outputs MCP | Mantener las herramientas y campos actuales; agregar agrupación sin volver inválidos los documentos ni comandos existentes | Sí, por schemas y descripciones | REST/persistencia compatible antes del scan; metadata MCP sólo en el candidato siguiente |
| Suprimir colisiones dentro del mismo grupo efectivo | API `validate_layout`; Core helper | El shape puede ser idéntico, pero cambia el significado de resultados | Conservar códigos/result shape; no emitir colisión sólo cuando ambos elementos comparten el mismo grupo externo; sí emitir entre grupos o con elementos sin grupo | No por sí solo si el schema no cambia, pero viaja con la versión de grupos | Después de persistir grupos y antes de las pruebas del nuevo candidato |
| Codec portable v3 y `slide.narration` | Core define; API proyecta; Web consume | Nuevos campos y nueva versión del documento en resultados/comandos | Migrar v1/v2 a v3 sin inventar narración; seguir atendiendo el contrato MCP ya publicado mediante una proyección compatible o herramientas nuevas versionadas | Sí | Backend compatible primero; no exponer un resultado v3 incompatible por una herramienta publicada |
| Audio WAV/MP3 admitido para narración | API assets; Web grabación/generación | Una ampliación silenciosa cambiaría la semántica publicada de `upload_asset` | Mantener `upload_asset` como imagen y agregar `upload_narration_audio`; sniffing y límites de audio, sin confiar en extensión/MIME | Sí por el tool/schema nuevo | Backend y storage primero; metadata visible en el nuevo scan |
| Grabar narración en `/editor` y reproducir modo narrado | Web | Ninguno para el MCP backendless, pero comparte artifact con las rutas Cloud | Debe seguir sin llamadas al API; usar assets embebidos de Core v3; no liberar la SPA completa mientras Cloud siga en codec v2 | No | Release Web coordinado después del soporte API v3 |
| Grabar/reproducir narración en rutas Cloud | API REST + Web Cloud | No necesariamente MCP si REST se mantiene separado | Persistencia relacional de narración y assets; mismas reglas portables que Core; degradación clara si una slide no tiene audio | No por la UI/REST; sí cuando se expone a herramientas MCP | Después del soporte API y antes de la QA del candidato MCP |
| Crear/editar narración desde ChatGPT | API MCP + Plugin skills/evals | Nuevas operaciones, schemas, descripciones y casos de review | Preferir operaciones aditivas; conservar cada herramienta publicada y todos sus inputs válidos | Sí | Sólo en la próxima versión revisada |
| Generación de voz por proveedor | Web/API host, fuera del codec | Puede ser server-only mientras no cambie metadata MCP | El documento guarda sólo audio y provenance; proveedor, voice ID, consentimiento, créditos y jobs permanecen en el host | Sólo si se expone como tool o cambia metadata | Fase posterior; no bloquear grabación propia ni playback |

## Bloqueadores detectados en el API local

El worktree actual de `deks-api` no debe desplegarse como está:

- elimina `rename_element` y la reemplaza por `update_element_identity`;
- cambia `list_icon_catalog` de `paths` a `nodes` y agrega campos requeridos;
- agrega `codecVersion: 2` como literal requerido en `get_presentation`;
- cambia campos de texto desde estado a identidad;
- aún no implementa codec v3, narración Cloud ni la exclusión de colisiones dentro
  del mismo grupo.

Esas primeras cuatro modificaciones pueden romper el snapshot que ChatGPT ya
publicó o está revisando. La rama siguiente debe reestructurarlas así:

1. conservar `rename_element` con su comportamiento y schema actuales;
2. agregar `update_element_identity` como herramienta nueva o capacidad adicional,
   nunca como reemplazo durante este rollout;
3. conservar la salida `paths` del catálogo o publicar una herramienta/version de
   salida nueva para `nodes`;
4. mantener `get_presentation` compatible con su output publicado; si el v3 no se
   puede representar aditivamente, agregar una lectura v3 versionada;
5. seguir aceptando los campos de texto legacy y mapearlos al nuevo modelo relacional;
6. ampliar `apply_commands` sólo con operaciones opcionales, manteniendo válidos
   todos los comandos actuales;
7. agregar tests de contrato contra una copia exacta del snapshot 0.3.3 antes de
   probar las capacidades nuevas.

## Secuencia de implementación del próximo candidato

### Gate 0 — esperar el resultado actual

- No cambiar el MCP vivo de una forma que altere tool list, schemas, annotations,
  security schemes, `_meta`, visibilidad, server instructions o resource URIs.
- Se permiten sólo fixes server-side que mantengan el contrato publicado exacto.
- No mezclar los cambios locales de API/Web/Plugin con el candidato en review.

### Gate 1 — fijar el baseline

1. Registrar versión publicada, versión revisada, timestamp del scan y resultado.
2. Exportar desde una fuente no secreta el tool list y sus schemas aprobados.
3. Guardar ese snapshot como fixture inmutable de compatibilidad en `deks-api`.
4. Registrar `a0429fd1` / API 0.9.6 como source desplegado y recuperar un gate CI
   verde antes de usarlo como baseline del siguiente release.

### Gate 2 — API/Cloud compatible

1. Rebasar el trabajo API sobre el baseline confirmado, preservando los 35 contratos
   existentes.
2. Llevar el documento Cloud directamente al contrato Core 6 / codec v3; no liberar
   el codec v2 local como una estación pública intermedia.
3. Modelar narración relacionalmente: script y pausas por slide; referencia al asset
   admitido y provenance; sin JSON/JSONB para el dominio.
4. Modelar assets de audio sin forzar las dimensiones obligatorias de imagen:
   metadata relacional discriminada, duración, canales y sample rate.
5. Agregar `upload_narration_audio` con inspección real de bytes y límites Core,
   manteniendo `upload_asset` y su result shape intactos para imágenes.
6. Implementar grupos anidados acíclicos y hacer `validate_layout` consciente del
   grupo externo efectivo.
7. Probar migraciones adelante/atrás, import/export v1-v3, REST, MCP legacy, MCP nuevo,
   assets y fixture del reviewer antes de desplegar.

### Gate 3 — Web

1. Integrar la branch `release-after-plugin-review` sobre Core 6.0.0 publicado.
2. Mantener `/editor` completamente local: grabación WAV, script, pausas, reemplazo,
   borrado y presentación narrada sin API.
3. Implementar la persistencia Cloud sólo contra endpoints API reales de codec v3;
   no inventar comandos mientras API siga en v2.
4. Ampliar la publicación/lectura pública para resolver audio admitido; hoy esa ruta
   materializa sólo imágenes y descartaría descriptores de narración.
5. Implementar la experiencia de grupos que aún falta: crear/renombrar grupo,
   asignar/reasignar/quitar `parentId`, árbol plegable tipo carpetas y reglas de
   borrado, sin convertir coordenadas a relativas.
6. Cerrar el gate completo de Web. Hoy `validate:workflows`, typecheck y build están
   verdes, pero el suite completo tiene timeouts reproducidos en
   `FormControls.test.tsx` y `DeksEditor.test.tsx`; ambos son blockers hasta obtener
   una corrida reproducible verde.

### Gate 4 — metadata y bundle siguiente

1. Elegir una versión nueva del Plugin, previsiblemente 0.4.0 por el salto de
   capacidades, sin cambiar el ID técnico de la conexión ni el origin MCP.
2. Crear, sin reescribir los artifacts 0.3.3, una Cloud skill empaquetada, tool
   worksheet, cinco casos positivos, tres negativos, release notes y copy de portal
   para 0.4.0. Mantener Desktop como host local separado.
3. Hacer que el validador compare el snapshot empaquetado de 0.4.0 —o hashes
   registrados— además de las skills vivas del worktree.
4. Desplegar primero API/Web compatible y probar el contrato viejo contra producción.
5. Ejecutar **Scan Tools** en un draft nuevo/actualizado, comparar cada nombre,
   título, descripción, schema, annotation y security scheme con el bundle.
6. Probar desde una conversación nueva: grupos/colisiones, grabación y playback Web,
   audio adjunto, narración sintética cuando exista, concurrencia, undo y casos de
   seguridad.
7. Enviar a review sólo con autorización explícita. El review debe apuntar al
   snapshot ya probado, no a metadata que todavía exista sólo en Git.

## Rama si el review actual es aprobado

1. Publicar exactamente el snapshot aprobado, sin incorporar los cambios siguientes.
2. Verificar la versión visible y hacer smoke read-only de las herramientas publicadas.
3. Confirmar que los casos mutadores del reviewer no dejaron datos de fixture que
   requieran reset.
4. Ejecutar Gates 1–4 y enviar 0.4.0 como un update separado.
5. Mantener operativos los contratos de 0.3.3 después de publicar 0.4.0.

## Rama si el review actual es rechazado

1. Mantener la versión actualmente publicada; no publicar el snapshot rechazado.
2. Registrar el finding textual del portal sin copiar credenciales ni datos de sesión.
3. Clasificarlo como metadata/schema, OAuth/security, fixture/eval, policy/copy o bug
   del servidor.
4. Preparar la corrección mínima y compatible sobre 0.3.3. No incluir narración,
   grupos ni codec v3 salvo que sean indispensables para resolver ese finding.
5. Desplegar sólo el soporte necesario, ejecutar un nuevo scan y repetir los casos
   afectados.
6. Reenviar o apelar únicamente con autorización explícita.
7. Cuando esa corrección sea aprobada/publicada, retomar Gates 1–4 para 0.4.0.

## Criterios de salida

El siguiente update queda listo para review cuando:

- el contrato 0.3.3 pasa íntegro contra el MCP vivo;
- ninguna herramienta publicada fue eliminada o renombrada y ningún schema perdió
  inputs/outputs válidos;
- grupos suprimen sólo colisiones internas y conservan geometría absoluta;
- API, Web y `.deks` hacen round-trip de narración v3 con audio admitido;
- `/editor` funciona offline y las rutas Cloud usan exclusivamente contratos reales;
- el suite completo de cada repo está verde, incluidas migraciones y fixtures de review;
- el nuevo Scan Tools coincide con el bundle versionado;
- el usuario autoriza el envío del nuevo snapshot.
