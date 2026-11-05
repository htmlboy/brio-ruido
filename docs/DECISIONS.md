# Registro de decisiones

Cada cambio que afecte al producto, la arquitectura, la interfaz, los contenidos o la publicación debe actualizar la especificación correspondiente y registrar aquí su motivo. Los resultados de comprobaciones se anotan en `VALIDATION.md`; este registro no convierte comprobaciones pendientes en realizadas.

## D-001 — Aplicación estática y escenas locales

Estado: vigente. React, TypeScript y Vite; audio con Web Audio API; escenas versionadas en `localStorage`. El objetivo es mezclar durante una partida sin cuentas ni servidor. Se permite exportar/importar escenas JSON para copias de seguridad. No se exporta audio.

## D-002 — Publicación en GitHub Pages

Estado: vigente. Repositorio público `htmlboy/ruido`, publicación desde GitHub Actions. El usuario activó Pages tras los errores de permisos de la integración. Los recursos usan rutas relativas para permitir pasar de `/ruido/` a un dominio propio.

## D-003 — Licencia restrictiva del código

Estado: vigente por petición del usuario. Código e interfaz originales: todos los derechos reservados; uso personal de la web oficial permitido. Los audios y dependencias conservan sus licencias. La licencia MIT aplicada inicialmente no se revoca para versiones ya distribuidas bajo ella. Referencia: `LICENSE`.

## D-004 — Audio de iOS

Estado: implementada; escucha real pendiente de confirmación. Se solicita la sesión `playback` cuando existe la API y se admite reanudar `interrupted`. El usuario también señaló un posible bloqueo de contenido. No se considera demostrada una única causa de la incidencia original. Referencia: `VALIDATION.md`.

## D-005 — Herramienta de mezcla, sin presentación promocional

Fecha: 2026-11-05. Estado: publicada, commit `11a90b2`.

A petición del usuario se retiran eslóganes, hero, onda ficticia, ilustraciones y fuentes externas. La biblioteca pasa a filas; las escenas son compactas y el transporte queda accesible al desplazar. En móvil la mezcla se abre desde el transporte inferior. Se priorizan acciones, legibilidad y estados reales. La revisión fue heurística; no había un preset especializado instalado. Referencia: `DESIGN-REVIEW.md`.

## D-006 — Biblioteca dramática

Fecha: 2026-11-05. Estado: publicada, commit `11a90b2`.

Se mantienen las 24 pistas anteriores y sus identificadores y se añaden 12: diez composiciones de OpenGameArt y dos capas originales. El catálogo cubre tensión, horror y acción además de ambientes cotidianos. Se preparan ocho escenas narrativas. Se descartan candidatos de Freesound que no se pudieron descargar; los archivos distribuidos tienen licencia y procedencia documentadas. Referencia: `audio/dramatic-sources.json` y `../ATTRIBUTIONS.md`.

## D-007 — Dominio propio

Fecha: 2026-11-05. Estado: definido; configuración externa pendiente.

El usuario ha registrado `briorol.com` y decide alojar Ruido en `ruido.briorol.com`, con DNS gestionado en Cloudflare y alojamiento en GitHub Pages. No se migra el alojamiento. El CNAME previsto es `ruido` → `htmlboy.github.io`, inicialmente sin proxy.

No hay conector de Cloudflare en el catálogo disponible y la integración de GitHub devuelve 403 al configurar el dominio personalizado. Los ajustes manuales y las comprobaciones posteriores se documentan en [DOMAIN.md](DOMAIN.md). No se ha cambiado DNS ni el dominio activo. Las escenas locales se trasladan mediante exportación/importación JSON al cambiar de origen.
