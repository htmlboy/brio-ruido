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

El entorno no ofrece el control de navegador requerido para las pruebas visuales e interactivas. Por tanto, aún no se acredita la matriz Chrome/Firefox/Safari/Edge, Safari iOS/Chrome Android, la navegación completa con lector de pantalla, la escucha de tres bucles por pista ni la prueba de diez minutos en dispositivos reales. Las pruebas automatizadas del motor usan un contexto de audio simulado; no sustituyen una escucha real.

Esta es una primera versión para revisión, no la declaración de que todos los criterios manuales de aceptación del MVP estén superados.

## Estado de publicación

Primera versión desplegada en **https://htmlboy.github.io/ruido/** desde el repositorio público `htmlboy/ruido`.

El usuario activó GitHub Pages con origen GitHub Actions. El flujo [41929712441](https://github.com/htmlboy/ruido/actions/runs/41929712441) completó instalación, las 16 pruebas, compilación y despliegue del commit `9bd9faf`.

El código y la interfaz originales se distribuyen con todos los derechos reservados; los audios conservan sus licencias y se incluyen avisos de dependencias de terceros. Las limitaciones de validación manual indicadas arriba siguen pendientes.

## Corrección de reproducción en iOS

Se solicita `navigator.audioSession.type = 'playback'` antes de activar Web Audio, cuando la API está disponible, para evitar la ruta de audio ambiental que puede quedar silenciada en iOS. También se permite reanudar el estado `interrupted` de Safari mediante un nuevo gesto del usuario. La API opcional puede fallar sin impedir la reproducción en otros navegadores.

19 pruebas automáticas pasan, incluidas tres regresiones para el modo de sesión, la API no soportada y la recuperación de una interrupción. La confirmación auditiva en el dispositivo del usuario sigue pendiente.
