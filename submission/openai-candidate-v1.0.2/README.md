# DEKS 1.0.2 — candidato público separado

Paquete preparado y validado localmente, actualizado el 9 de octubre de 2026.
Existe un nuevo borrador 1.0.2 después de la eliminación confirmada del registro
anterior. La demo y la aclaración Productivity ya se incluyeron en el ZIP cargado. Esta
actualización modifica únicamente procedimientos de casos para usar revisiones
actuales y preservar fixtures; no acredita envío ni ejecución completa de casos
contra el cliente exacto de la versión guardada.

El ZIP `dist/deks-openai-1.0.2.zip` conserva el nombre técnico empaquetado: `app-6a8bb31ee2b481919a609ef99cae1422`. Contiene un solo directorio raíz,
`plugin.json` portable, `mcp.json`, las cuatro skills Cloud y el icono real DEKS
de 512 × 512 px. No contiene bindings `.app.json`, declaraciones `apps`, manifests
de compatibilidad, credenciales, `.DS_Store`, Git, contratos ni notas internas.

La metadata de listado, los cinco casos positivos, tres negativos y las notas
de release viven dentro de `extensions.com.openai`. Los prompts expresan metas
naturales; herramientas, argumentos y condiciones observables aparecen en las
expectativas. Los casos cubren lectura de layout, narración, centrado conservando
texto/identidad, preparación de tarjeta con espera humana y creación con
continuidad de un número más QA. El executor de borrado queda como extensión
opcional exclusivamente humana.
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

1. Cargar esta actualización únicamente de metadata de casos en el mismo
   borrador. El ZIP anterior `25387966…` tenía No Issues, cuatro skills Checks
   passed y categoría resuelta. Su copia exacta se conserva en
   `evidence/before-case-constraints-25387966.zip`. Los ocho prompts, listing,
   demo, skills y contrato permanecen iguales.
2. Verificar las pruebas con revisiones/IDs recién devueltos, preservando todas
   las fixtures. Narración admite no-change idempotente si ya coincide. Test B
   requiere el texto canónico establecido por el reviewer, conservado en la
   edición. La tarjeta se prepara usando el count/revisión actuales y el agente
   espera; la ejecución irreversible es solo una extensión humana opcional.
3. La creación permite decks anteriores con el mismo nombre: debe crear
   exactamente un deck NUEVO y usar exclusivamente sus IDs retornados. El count
   final es baseline + 1; todos los IDs, revisiones e historia anteriores se
   preservan. No requiere ausencia del nombre ni eliminar ensayos anteriores.
4. Root verifica el guardado de acceso reviewer reportado por Felipe y aplica
   las seis declaraciones legales ya aprobadas después de la última recarga.
   La respuesta humana directa permite continuar; un Form vacío no agrega
   otra solicitud de aprobación. Ensayos MCP v2 del helper verificaron narración
   y centrado de A/B (4→5; restaurados seguros a 6 con historia conservada) y
   preparación de tarjeta de Promotion con espera, sin executor o borrado.
   Son pruebas funcionales representativas, no pase del cliente con las cuatro
   skills exactas cargadas. El intento reportado del cliente exacto devolvió
   PluginNotFound y no se declara pase global. Comprobar el estado actual del
   cliente/portal sin tratar ese evento anterior como prueba de su estado futuro.

Los cuatro enlaces de listado reutilizan las URLs confirmadas de DEKS. El
coordinador verificó sus páginas públicas en Chrome durante esta entrega.
`countries: []` mantiene deliberadamente el `Allow all` del registro 1.0.1.
Commerce se omite: no se infiere una declaración del portal a partir de las
páginas de planes. Credenciales e instrucciones privadas de acceso permanecen
en los campos seguros del portal, nunca en este ZIP.

La publicación posterior requiere aprobación y una acción propia; este archivo
no anuncia aprobación, publicación ni ejecución de los casos.
