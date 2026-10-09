# DEKS 1.0.2 — candidato público separado

Paquete preparado y validado localmente, actualizado el 9 de octubre de 2026.
Existe un nuevo borrador 1.0.2 después de la eliminación confirmada del registro
anterior. La demo existente verificada ya se incluyó en el ZIP cargado. Esta actualización
aclara el propósito Productivity y agrega cinco capacidades soportadas; no acredita
envío a revisión ni ejecución de los ocho casos contra la versión guardada.

El ZIP `dist/deks-openai-1.0.2.zip` conserva el nombre técnico empaquetado: `app-6a8bb31ee2b481919a609ef99cae1422`. Contiene un solo directorio raíz,
`plugin.json` portable, `mcp.json`, las cuatro skills Cloud y el icono real DEKS
de 512 × 512 px. No contiene bindings `.app.json`, declaraciones `apps`, manifests
de compatibilidad, credenciales, `.DS_Store`, Git, contratos ni notas internas.

La metadata de listado, los cinco casos positivos, tres negativos y las notas
de release viven dentro de `extensions.com.openai`. Los prompts expresan metas
naturales; herramientas, argumentos y condiciones observables aparecen en las
expectativas. Los casos cubren lectura de layout, narración, centrado conservando
texto/identidad, borrado humano y creación con continuidad de un número más QA.
Los negativos comprueban ambigüedad destructiva, archivo local sin adjunto y secretos.

El contrato fuente copiado de API es `openai-v2`: 37 descriptores, 36 visibles al
modelo y un ejecutor privado. Su SHA-256 es
`152e579e92f25f1aa9fc6fe350e6de0eaf220d6cd3ac19f91e28c661661ddc63`.
El candidato elimina el dispatcher genérico, usa `prepare_presentation_deletion`
y la tarjeta v5. Preserva continuidad de identidades, revisiones e idempotencia.
Las instrucciones generales y los artefactos 0.4.2 permanecen sin modificaciones.
`evidence/preservation-sha256.json` protege 43 archivos preexistentes.

## Validación reproducible

Desde `deks-plugin/`:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s submission/openai-candidate-v1.0.2/tests -v
PYTHONDONTWRITEBYTECODE=1 python3 submission/openai-candidate-v1.0.2/scripts/package_validation.py --build
node scripts/validate-openai-submission.mjs
git diff --check
```

El builder usa inventario permitido, nombres ordenados, fecha ZIP fija y permisos
fijos. Verifica los bytes del archivo real contra la fuente. Repetir el build con
los mismos archivos genera el mismo SHA-256. `dist/SHA256SUMS` registra el ZIP;
`evidence/validation-report.json` registra las comprobaciones de esta entrega.

Los schemas oficiales de Agent Plugins 1.0 se conservaron en `evidence/` y ambos
manifiestos pasaron AJV CLI 5.0.0, Draft 2020-12, en modo estricto. El namespace
OpenAI requiere además la validación del portal; el schema portable no certifica
su importación ni aceptación. Los campos de review/publication siguen la guía
de Plugin Creator vigente. El primer intento de importación fue rechazado antes
de crear un draft por usar nombres de campos incorrectos en la traducción. La
guía oficial exige `translations.<locale>.subtitle` y `description` (30 y 4000
caracteres); se corrigió el mapeo conservando el texto. Una prueba semántica
rechaza los alias anteriores, además del schema portable. El segundo intento
también fue rechazado antes de crear un draft: el portal exige configurar la
conexión MCP existente antes de actualizar el ZIP y el coordinador observó la
app original como `Unavailable`. Posteriormente, Felipe confirmó eliminar ese
registro y el coordinador verificó su desaparición; se recreó el nuevo borrador
1.0.2, ahora configurado y autorizado. Los dos rechazos quedan como evidencia
histórica y no describen el estado actual. Véase
`evidence/portal-validation.json` y la [guía oficial](https://developers.openai.com/plugins/deploy/submission).

`scripts/sync_contract.py` actualiza solo este candidato a partir de un export
API y un hash explícitamente verificado. `prepare_source.py` registra el staging
inicial desde el ZIP 1.0.1 y se niega a sobrescribir este candidato o sus hashes;
no debe usarse para reconstruir las instrucciones finales adaptadas manualmente.

## Demo reutilizada y pendientes

El coordinador revisó la [demo existente no listada](https://www.youtube.com/watch?v=0Pj75qxVRL8)
el 9 de octubre: 88,461 segundos, autoría ChatGPT → DEKS/editor con tres slides,
bloques, números, movimiento, identidades compartidas e iteración sobre la misma
presentación. Se reutiliza como walkthrough funcional del core. El flujo visual
se conserva; los cambios 1.0.2 corresponden a dispatch, nombres y anotaciones MCP,
y el coordinador observó además autoría real 40% → 65% con parámetros v2 actuales.
No se exige una nueva grabación solamente por el número de versión. Esta demo
no certifica todos los descriptores, las cuatro skills 1.0.2 cargadas, la nueva
tarjeta de borrado ni ejecución/passing de los ocho casos del borrador exacto.

`readiness.json` mantiene los gates sin inventar ejecuciones. El comando
`package_validation.py --submission-ready` sigue rechazando la entrega mientras
falte acceso reviewer, ejecución de casos, verificación de la actualización del
portal o declaraciones del desarrollador.

1. Cargar esta única aclaración del listado en el nuevo borrador 1.0.2 y verificar
   la descripción principal, traducción es-419 y cinco capabilities importadas.
   Tras cargar el ZIP con demo, SHA256 `9206f854…`, apareció un warning de categoría
   Productivity explícitamente no bloqueante. Se mantiene la categoría válida;
   si persiste el warning no se harán más rerolls del listado. Los ZIP cargados
   anteriormente `9707be7b…` y `9206f854…` se preservaron aparte como evidencia. La recreación tuvo metadata No Issues, cuatro
   skills Checks Passed y 37 herramientas/instrucciones con cero issues; el
   catálogo escaneado coincide semánticamente con el contrato fijado.
2. Verificar acceso reviewer y ejecutar los casos contra la versión exacta
   guardada, con fixtures independientes y resets autorizados. La autorización
   OAuth fresca del coordinador ya se verificó y no reemplaza el acceso reviewer.
   El worksheet no prueba la revisión actual de las fixtures ni ejecución exitosa.
3. Comprobar la reproducción de la demo desde el contexto reviewer, revisar
   targeting, translations y commerce en el nuevo registro y completar las
   declaraciones del desarrollador antes del envío. Los campos omitidos no
   pueden depender de herencia del registro eliminado.

Los cuatro enlaces de listado reutilizan las URLs confirmadas de DEKS. El
coordinador verificó sus páginas públicas en Chrome durante esta entrega.
`countries: []` mantiene deliberadamente el `Allow all` del registro 1.0.1.
Commerce se omite: no se infiere una declaración del portal a partir de las
páginas de planes. Credenciales e instrucciones privadas de acceso permanecen
en los campos seguros del portal, nunca en este ZIP.

La publicación posterior requiere aprobación y una acción propia; este archivo
no anuncia aprobación, publicación ni ejecución de los casos.
