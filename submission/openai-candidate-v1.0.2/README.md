# DEKS 1.0.2 — candidato público separado

Paquete preparado y validado localmente el 8 de octubre de 2026. No está enviado
a revisión ni acredita ejecución del contrato nuevo en producción o ChatGPT.

El ZIP `dist/deks-openai-1.0.2.zip` conserva el nombre técnico del complemento
existente: `app-6a8bb31ee2b481919a609ef99cae1422`. Contiene un solo directorio raíz,
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
app original como `Unavailable`. El coordinador investiga esa configuración;
este candidato preserva la misma identidad y conexión, sin crear otra app. Véase
`evidence/portal-validation.json` y la [guía oficial](https://developers.openai.com/plugins/deploy/submission).

`scripts/sync_contract.py` actualiza solo este candidato a partir de un export
API y un hash explícitamente verificado. `prepare_source.py` registra el staging
inicial desde el ZIP 1.0.1 y se niega a sobrescribir este candidato o sus hashes;
no debe usarse para reconstruir las instrucciones finales adaptadas manualmente.

## Pendientes para la nueva postulación

`readiness.json` mantiene los gates y resultados por superficie sin inventar
ejecuciones. El comando `package_validation.py --submission-ready` rechaza la
entrega mientras falte la demo o los gates del candidato.

1. Restaurar la configuración de la app MCP existente y contrastar los 37
   descriptores live con el contrato exacto. El coordinador verificó el release
   canónico `v0.16.0` (verify/deploy) y ambos CI en verde, además de lecturas MCP
   autenticadas y rechazo de `apply_commands` sin mutación. El catálogo completo
   sigue sin hash verificado; la configuración del portal aparece `Unavailable`
   y su rescan está deshabilitado.
2. Verificar OAuth/acceso reviewer del candidato y ejecutar los casos contra la
   versión exacta guardada en el portal, con fixtures independientes y resets
   autorizados. Test A/Test B fueron observados por el coordinador en revisión 3;
   la revisión 1 del setup requiere reset y no se asume como estado actual.
3. Registrar una demo real 1.0.2, revisar reproducción/contenido sin secretos y
   agregar su URL verificada al manifiesto antes de reconstruir el ZIP. La demo
   histórica no se declara suficiente para la nueva UI o herramientas.
4. Verificar en el mismo complemento las importaciones, scans, targeting,
   translations y campos omitidos preservados, luego completar las declaraciones
   del desarrollador y enviar solo dentro de la autorización vigente.

Los cuatro enlaces de listado reutilizan las URLs confirmadas de DEKS. El
coordinador verificó sus páginas públicas en Chrome durante esta entrega.
`countries: []` mantiene deliberadamente el `Allow all` del registro 1.0.1.
Commerce se omite: no se infiere una declaración del portal a partir de las
páginas de planes. Credenciales e instrucciones privadas de acceso permanecen
en los campos seguros del portal, nunca en este ZIP.

La publicación posterior requiere aprobación y una acción propia; este archivo
no anuncia aprobación, publicación ni ejecución de los casos.
