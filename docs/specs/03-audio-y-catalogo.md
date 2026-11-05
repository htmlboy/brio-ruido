# Audio y catálogo

Estado: especificación vigente. Implementación publicada; comprobaciones manuales pendientes indicadas en [VALIDATION.md](../VALIDATION.md).

## Motor de reproducción

Usar Web Audio API con buffers decodificados para ambientes y un HTMLAudioElement por pista de música larga, conectado al mismo grafo de ganancias. Ambas modalidades reproducen en bucle y se cargan solo bajo demanda. Cada fuente tiene una ganancia individual y todas pasan por una ganancia general. El contexto se activa mediante una interacción del usuario; si el navegador lo suspende, la interfaz indica que hace falta reanudarlo.

Valores iniciales propuestos:

| Comportamiento | Duración |
| --- | --- |
| Entrada o salida individual | 0,5 segundos |
| Cambio de escena | 2 segundos |
| Parar todo | Hasta 50 milisegundos |

Los cambios de volumen usan rampas breves para evitar chasquidos. Una transición de escena interpola ganancias: las pistas compartidas continúan sin reiniciarse, las nuevas entran y las que desaparecen salen. El volumen general permanece igual. Interrumpir una transición parte de los niveles actuales y no provoca saltos.

El límite de ocho pistas corresponde a la mezcla final. Durante un cambio normal pueden coexistir hasta dieciséis fuentes temporalmente. Si se interrumpen varias transiciones, pueden mantenerse colas adicionales hasta acabar sus fundidos; el catálogo inicial acota el total al número de pistas del catálogo. Al terminar o cancelar se liberan las fuentes que ya no hacen falta.

## Preparación del material

Cada archivo debe escucharse durante al menos tres repeticiones para revisar su unión, ruido accidental y variaciones molestas. Se preparan puntos de bucle o un fundido cruzado dentro del propio archivo cuando sea necesario. La reproducción usa los puntos definidos en el catálogo, sin depender de encadenar eventos del navegador.

Los niveles se ajustan para que las pistas tengan volúmenes recomendados útiles y suficiente margen de mezcla. La combinación más intensa de las escenas de ejemplo se verifica sin saturación audible. Se propone un compresor de protección en la salida; no sustituye el ajuste del material.

## Catálogo inicial

Categorías: tensión, horror, acción, naturaleza, clima, agua, ciudad, interiores y música. Ejemplos: bosque, insectos nocturnos, lluvia suave, tormenta, viento, río, oleaje, tráfico lejano, mercado, cafetería, taberna y bases electrónicas discretas.

La música es opcional y no necesita sincronizarse con otras pistas. El catálogo de lanzamiento debe contener variedad suficiente para preparar al menos tres escenas distintas.

## Fuentes y licencias

Se priorizan CC0 y dominio público con procedencia verificable. Se puede incorporar CC BY si se cumplen las atribuciones y se documentan las modificaciones. OGA-BY 3.0 se acepta con atribución, enlace a la licencia y modificaciones documentadas. Otras licencias requieren revisar sus condiciones antes de aceptar el archivo; no se presume que todo el contenido de una biblioteca sea reutilizable.

OpenGameArt, Wikimedia Commons y Freesound son posibles fuentes de selección, no dependencias de reproducción en directo. Los archivos aprobados se alojan con la aplicación. No se distribuyen audios de prueba sin una licencia conocida.

Cada pista incluye identificador estable, título, categoría, etiquetas, ruta local, autor, URL de origen, licencia y su URL, cambios realizados, volumen recomendado y puntos de bucle opcionales. Incluso en CC0 se conserva la procedencia. La aplicación ofrece créditos visibles y un registro Markdown de atribuciones acompaña a los archivos.

## Rendimiento y compatibilidad

La aplicación no descarga toda la biblioteca al abrir. Carga audio bajo demanda y reutiliza los buffers de la mezcla; una caché acotada libera buffers inactivos. Objetivo inicial: hasta 128 MiB de buffers decodificados retenidos, incluida la transición. El tamaño PCM se estima antes de aprobar el catálogo y las escenas de ejemplo.

Se comprobarán versiones estables actuales de Chrome, Firefox, Safari y Edge, además de Safari en iOS y Chrome en Android. La suspensión en segundo plano depende del navegador y del sistema; no se promete reproducción en segundo plano ni con la pantalla bloqueada.

## Selección musical completa

Se incluyen 18 composiciones de Kevin MacLeod / Incompetech bajo CC BY 4.0; el catálogo activo pasa a 54 pistas. Los archivos completos se sirven con la aplicación y se comprimen a MP3 estéreo de 128 kbps, sin importar el catálogo entero ni usar almacenamiento externo. Son una selección editorial para rol, no la lista confirmada de la consola de referencia.

Las pistas con `playback: 'stream'` usan elementos multimedia para evitar decodificar toda su duración en PCM. La preparación debe permanecer silenciosa, arrancar dentro del gesto del usuario, poder cancelarse y preservar la mezcla anterior si falla. Las pistas musicales compartidas continúan sin reiniciarse al cambiar de escena. Los archivos mantienen sus finales musicales originales; su audición y calidad de repetición siguen pendientes. Fuentes, límites y proceso en [MUSIC-SELECTION.md](../MUSIC-SELECTION.md).
