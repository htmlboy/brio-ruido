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

## D-010 — Seis temas completos de música dramática

Fecha: 2026-11-05. Estado: implementada.

Se elige una selección editorial acotada de seis composiciones de Kevin MacLeod / Incompetech, con CC BY 4.0, créditos y fuentes por pista. No se importa todo el catálogo ni se presenta la selección como la lista verificada de Delta Green Audio Console. Se conservan los títulos y las estructuras completas; se recodifica a MP3 estéreo de 128 kbps. El conjunto añade 27,8 MiB y se aloja con la aplicación, sin R2.

La música larga usa elementos multimedia conectados al grafo de Web Audio; los ambientes siguen en buffers. Se conservan ganancias, parada, carga cancelable y continuidad de las pistas compartidas. Oppressive Gloom queda disponible para crear mezclas de drama y consecuencias. Referencia: [MUSIC-SELECTION.md](MUSIC-SELECTION.md).

## D-011 — Aventura y variedad de escenas

Fecha: 2026-11-05. Estado: implementada.

Se amplía la selección musical de seis a 18 piezas completas de Kevin MacLeod, conservando CC BY 4.0, fuentes oficiales, créditos y hashes individuales. Siete de las nuevas composiciones cubren viaje, fantasía, exploración y descanso; las restantes amplían acción heroica, batalla, huida, infiltración y ritual. No se importa el catálogo completo. La biblioteca suma 54 pistas y añade la categoría Aventura.

Las escenas pasan de ocho a 16, con seis de aventura, ocho de tensión y dos cotidianas. Los filtros de tono y el despliegue opcional permiten ampliar la selección sin alargar de entrada toda la página. Las ilustraciones pueden repetirse si el entorno lo justifica. El tono es metadato de las escenas de ejemplo; no cambia el formato de guardado ni obliga a clasificar escenas personales.

## D-012 — Firma pública del autor

Fecha: 2026-11-05. Estado: aplicada a la licencia.

Los créditos propios usan Javier U, el seudónimo elegido por el autor para sus proyectos de rol. La licencia mantiene todos los derechos reservados y no modifica las atribuciones de audio ni las licencias de terceros.

## D-013 — Identidad de Ruido dentro de Brío

Fecha: 2026-11-05. Estado: implementada; publicación mediante el PR #6.

Se usa el maestro independiente de Ruido, sin punto añadido, y Brío en un enlace separado del pie. La herramienta comparte Plex, tonos cálidos y la familia de rojo con las otras webs. Conserva el fondo oscuro, las ilustraciones de escenas y la distribución de biblioteca y mezcla. Se eliminan marcos redundantes y se ajusta la cabecera móvil. Motor, catálogo, identificadores y guardado permanecen sin cambios. Referencia: [FAMILY-IDENTITY.md](FAMILY-IDENTITY.md).
