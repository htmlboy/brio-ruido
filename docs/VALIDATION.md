# Primera versión: decisiones y validación

## Implementado

Aplicación React + TypeScript + Vite, Web Audio API y persistencia local versionada. Catálogo de 24 pistas: 12 grabaciones abiertas y 12 capas sintetizadas originales, incluidas cuatro bases musicales. Seis escenas de ejemplo. Los audios completos distribuidos ocupan aproximadamente 3 MiB y se cargan bajo demanda.

La identidad visual usa tonos oscuros, acentos verde claro, ilustraciones vectoriales originales y una disposición de biblioteca y mesa de mezcla. El diseño incorpora puntos de adaptación a pantallas pequeñas.

## Decisiones respecto a la propuesta

- Se incorpora exportación e importación de escenas JSON para permitir copias de seguridad de los datos locales. No se exporta audio ni se sincronizan escenas con servidores.
- Los ejemplos incluyen una escena futurista para aprovechar las capas electrónicas.
- Los cambios rápidos pueden solapar las colas de más de una transición; las fuentes quedan acotadas por las 24 pistas del catálogo y se liberan al finalizar sus fundidos. Un cambio normal entre dos mezclas usa como máximo 16 fuentes. Todos los buffers del catálogo inicial juntos quedan por debajo del objetivo de 128 MiB.
- Las grabaciones se han recortado a bucles cortos y comprimidos para un primer lanzamiento ligero. Los ambientes con eventos reconocibles pueden resultar repetitivos durante sesiones largas.

## Comprobaciones realizadas

- 16 pruebas automáticas: catálogo, archivos, procedencia, escenas, búsqueda, persistencia y validación; cancelación de cargas, parada, fallos, prioridad de la última escena y continuidad de fuentes compartidas.
- Comprobación de tipos TypeScript y compilación de producción.
- Decodificación de los 24 MP3 con ffmpeg, verificación de muestras finitas, niveles sin saturación individual y comprobación numérica básica de las uniones.
- Procedencia y atribuciones de cada archivo incluidas en la aplicación y el repositorio. Versiones CC BY de ciudad, lluvia, tormenta y oleaje contrastadas en los enlaces originales de Freesound.

## Validación pendiente

Pendientes de validación visual, interactiva y auditiva en dispositivos reales: la matriz Chrome/Firefox/Safari/Edge, Safari iOS/Chrome Android, la navegación completa con lector de pantalla, la escucha de tres bucles por pista ni la prueba de diez minutos en dispositivos reales. Las pruebas automatizadas del motor usan un contexto de audio simulado; no sustituyen una escucha real.

Esta es una primera versión para revisión, no la declaración de que todos los criterios manuales de aceptación del MVP estén superados.

## Estado de publicación

Primera versión desplegada en **https://htmlboy.github.io/ruido/** desde el repositorio público `htmlboy/ruido`.

GitHub Pages publica con origen GitHub Actions. El flujo [41929712441](https://github.com/htmlboy/ruido/actions/runs/41929712441) completó instalación, las 16 pruebas, compilación y despliegue del commit `9bd9faf`.

El código y la interfaz originales se distribuyen con todos los derechos reservados; los audios conservan sus licencias y se incluyen avisos de dependencias de terceros. Las limitaciones de validación manual indicadas arriba siguen pendientes.

## Corrección de reproducción en iOS

Se solicita `navigator.audioSession.type = 'playback'` antes de activar Web Audio, cuando la API está disponible, para evitar la ruta de audio ambiental que puede quedar silenciada en iOS. También se permite reanudar el estado `interrupted` de Safari mediante un nuevo gesto del usuario. La API opcional puede fallar sin impedir la reproducción en otros navegadores.

19 pruebas automáticas pasan, incluidas tres regresiones para el modo de sesión, la API no soportada y la recuperación de una interrupción. La confirmación auditiva en un dispositivo real sigue pendiente.

## Revisión funcional de diseño y ampliación dramática

- Interfaz sin hero promocional, onda decorativa, ilustraciones de escenas ni fuentes externas. Escenas compactas y biblioteca en filas, con controles de reproducción y crédito por pista.
- Transporte fijo con volumen general y parada. En móvil, panel de mezcla desplegable desde ese transporte.
- 36 pistas: se mantienen las 24 anteriores y se añaden 10 composiciones de OpenGameArt y dos capas originales. Ocho escenas con usos narrativos diferenciados.
- 21 pruebas automáticas: se añaden verificación de fuentes/licencias por archivo, cobertura de categorías dramáticas y continuidad de identificadores antiguos.
- Los 12 archivos nuevos se decodifican con ffmpeg, contienen señal y no saturan individualmente. El catálogo ocupa aproximadamente 10,7 MiB comprimido. Las pruebas numéricas no sustituyen una escucha.
- Los buffers del catálogo completo equivalen a 97 MiB a 24 kHz. El navegador puede decodificar a una frecuencia superior (por ejemplo, unos 194 MiB a 48 kHz); la caché mide los buffers reales y descarta los inactivos al superar su objetivo de 128 MiB. Las mezclas activas y transiciones tienen prioridad sobre ese objetivo. La revisión de memoria y escucha en dispositivos reales sigue pendiente.
- La adaptación responsive, el contraste y la semántica se han revisado en el código; la comprobación visual e interactiva en navegador queda pendiente.

La selección inicial de Freesound no se distribuye: las descargas estaban bloqueadas. Las fuentes efectivamente utilizadas, sus autores, licencias, enlaces y huellas están documentadas en `docs/audio/dramatic-sources.json` y `src/catalog.json`.

## Publicación de la revisión del 5 de noviembre

El flujo [41988158509](https://github.com/htmlboy/ruido/actions/runs/41988158509) completó pruebas, compilación y despliegue del commit `11a90b2`. Se comprobó por HTTP que el bundle público contiene la interfaz nueva y que los doce audios añadidos coinciden por SHA-256 con los archivos preparados. Esto no sustituye la revisión visual ni la escucha en dispositivo real.

## Dominio propio verificado

El 2026-11-05 se verificó el CNAME público `ruido.briorol.com` → `htmlboy.github.io`, el dominio personalizado en GitHub Pages y el certificado aprobado. La portada devuelve HTTP 200 por HTTPS con validación TLS. Se comprobaron por HTTP HEAD 42 recursos, incluidos los 36 MP3, JavaScript, estilos, favicon y avisos de licencia.

Pendiente activar **Enforce HTTPS**: la respuesta por HTTP aún es 200, sin redirección a HTTPS. Esto no sustituye una comprobación auditiva ni de interacción en navegador.

## Ilustraciones y escenas personales

28 pruebas automáticas pasan. Las siete comprobaciones nuevas cubren escenas antiguas, persistencia de ilustración en exportación/importación, identificadores desconocidos, metadatos corruptos, asignación de las ocho escenas, generación de los 16 SVG sin recursos externos y radios nativos con una única selección. La compilación de producción pasa.

El repertorio se ha renderizado en una hoja de contacto y revisado visualmente. Esto verifica los dibujos y no equivale a una prueba de interacción o layout en un navegador real. La selección, edición, foco y carrusel móvil requieren esa revisión adicional. El audio y sus licencias no han cambiado.

## Selección musical acotada

Los seis MP3 completos de Incompetech se han verificado con ffprobe, en estéreo, con duración consistente con el catálogo y huellas SHA-256 coincidentes. Ocupan 27,8 MiB. El catálogo activo tiene 42 pistas y ocho escenas; todos los identificadores anteriores se conservan.

Se añaden pruebas de metadatos y procedencia de la selección y diez casos de reproducción musical con elementos simulados: activación síncrona desde el gesto, ausencia de buffers PCM para música, cancelación, preparación silenciosa, fallo de destino, liberación de medios, prioridad de la última escena, continuidad de posición, ganancias y reanudación. La audición real y la interacción multimedia en Safari/iOS siguen pendientes. No se interpreta una comprobación de archivos o una simulación como prueba de sonido físico.

## Ampliación de aventura y escenas — 2026-11-05

- Catálogo de 54 pistas, con 18 composiciones completas de Incompetech bajo CC BY 4.0. Verificados SHA-256, estéreo y duraciones con ffprobe para las 18.
- 16 escenas con identificadores únicos y referencias a archivos disponibles: seis de aventura, ocho de tensión y dos cotidianas. Las escenas anteriores mantienen sus IDs.
- 40 pruebas automatizadas superadas, incluidos filtros por tono, variedad de ilustraciones y compatibilidad de datos guardados. Compilación de producción correcta.
- Se mantiene pendiente la escucha de mezclas y uniones en dispositivos reales; las verificaciones automáticas no certifican el equilibrio subjetivo ni la salida de audio de Safari/iOS.

## Aplicación de la familia Brío

- Compilación de producción correcta y 40 pruebas existentes superadas.
- Navegador a 320, 390, 760, 1024 y 1440 px, sin desbordamiento horizontal de página; logos y fuente local cargados.
- Comprobados: búsqueda, reproducción de Lluvia, volumen por pista, guardado y persistencia tras recargar, parada, ayuda y apertura/cierre de mezcla móvil.
- Capturas en `docs/previews/ruido-family-desktop.png`, `ruido-family-mobile.png` y `ruido-family-mixer-mobile.png`.
- Pares principales de texto/acción con contraste calculado en `FAMILY-IDENTITY.md`; esto no equivale a una auditoría integral de accesibilidad.
- Sin cambios en audio, catálogo, escenas de ejemplo o formato de guardado; publicación sin source maps.
