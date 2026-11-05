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
