# Registro de decisiones

Cada cambio que afecte al producto, la arquitectura, la interfaz, los contenidos o la publicación debe actualizar la especificación correspondiente y registrar aquí su motivo. Los resultados de comprobaciones se anotan en `VALIDATION.md`; este registro no convierte comprobaciones pendientes en realizadas.

## D-001 — Aplicación estática y escenas locales

Estado: vigente. React, TypeScript y Vite; audio con Web Audio API; escenas versionadas en `localStorage`. El objetivo es mezclar durante una partida sin cuentas ni servidor. Se permite exportar/importar escenas JSON para copias de seguridad. No se exporta audio.

## D-002 — Publicación en GitHub Pages

Estado: vigente. Repositorio público `htmlboy/ruido`, publicación desde GitHub Actions. Pages se configura para publicar desde GitHub Actions. Los recursos usan rutas relativas para permitir pasar de `/ruido/` a un dominio propio.

## D-003 — Licencia restrictiva del código

Estado: vigente. Código e interfaz originales: todos los derechos reservados; uso personal de la web oficial permitido. Los audios y dependencias conservan sus licencias. La licencia MIT aplicada inicialmente no se revoca para versiones ya distribuidas bajo ella. Referencia: `LICENSE`.

## D-004 — Audio de iOS

Estado: implementada; escucha real pendiente de confirmación. Se solicita la sesión `playback` cuando existe la API y se admite reanudar `interrupted`. Los bloqueadores de contenido también pueden impedir la descarga del audio. No se considera demostrada una única causa de la incidencia original. Referencia: `VALIDATION.md`.

## D-005 — Herramienta de mezcla, sin presentación promocional

Fecha: 2026-11-05. Estado: publicada, commit `11a90b2`.

Se retiran eslóganes, hero, onda ficticia, ilustraciones y fuentes externas. La biblioteca pasa a filas; las escenas son compactas y el transporte queda accesible al desplazar. En móvil la mezcla se abre desde el transporte inferior. Se priorizan acciones, legibilidad y estados reales. La revisión es heurística y la validación visual en dispositivos reales queda pendiente. Referencia: `DESIGN-REVIEW.md`.

## D-006 — Biblioteca dramática

Fecha: 2026-11-05. Estado: publicada, commit `11a90b2`.

Se mantienen las 24 pistas anteriores y sus identificadores y se añaden 12: diez composiciones de OpenGameArt y dos capas originales. El catálogo cubre tensión, horror y acción además de ambientes cotidianos. Se preparan ocho escenas narrativas. Se descartan candidatos de Freesound que no se pudieron descargar; los archivos distribuidos tienen licencia y procedencia documentadas. Referencia: `audio/dramatic-sources.json` y `../ATTRIBUTIONS.md`.

## D-007 — Dominio propio

Fecha: 2026-11-05. Estado: configurado y verificado; pendiente activar la redirección obligatoria a HTTPS.

Ruido se publicará en `ruido.briorol.com`, con DNS gestionado en Cloudflare y alojamiento en GitHub Pages. No se migra el alojamiento. El CNAME previsto es `ruido` → `htmlboy.github.io`, inicialmente sin proxy.

Los ajustes de DNS, dominio personalizado y las comprobaciones posteriores se documentan en [DOMAIN.md](DOMAIN.md). El CNAME, el dominio personalizado y el certificado se han verificado; la web y los 36 audios responden por HTTPS. Las escenas locales se trasladan mediante exportación/importación JSON al cambiar de origen.

## D-009 — Ilustraciones como identificación de escenas

Fecha: 2026-11-05. Estado: implementada.

Se recuperan ilustraciones para reconocer escenas rápidamente, manteniendo la estructura funcional de biblioteca y mezcla. Las imágenes cumplen una función de identificación y no recuperan el hero ni la decoración de la primera versión. Las escenas del usuario pueden elegir y cambiar una imagen entre 16 SVG originales incluidos en la aplicación.

El campo opcional `art` se conserva en el esquema v1. Las escenas antiguas y las imágenes desconocidas usan una previsualización neutra; los valores desconocidos se preservan en los datos. No se admite subir imágenes ni enlazarlas desde terceros. La selección usa radios nativos, etiquetas y foco visible. Referencia: [SCENE-ART.md](SCENE-ART.md).

## D-010 — Inventario e importación de música de Incompetech

Fecha: 2026-11-05. Estado: importación preparada; publicación de medios pendiente.

Se inventaría el catálogo oficial con licencia declarada CC BY 4.0 y créditos por pista, sin confundirlo con la selección no confirmada de Delta Green Audio Console. Se añade un importador por ISRC o catálogo completo, con recibos, verificación de duración, presupuesto de disco y medios locales excluidos de Git. El lote de prueba consta de seis temas completos.

La biblioteca publicada sigue en 36 pistas. Un catálogo de aproximadamente 5 GB recodificado a 128 kbps requiere almacenamiento de medios separado y una estrategia de reproducción para música larga antes de incorporarse a la aplicación. Referencia: [INCOMPETECH-IMPORT.md](INCOMPETECH-IMPORT.md).
