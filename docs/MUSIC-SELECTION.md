# Selección musical acotada

## Alcance

Se incorporan seis composiciones completas de Kevin MacLeod / Incompetech, elegidas por su utilidad para investigación, amenaza, horror y consecuencias. Son una selección editorial del mismo compositor identificado por el autor de Delta Green Audio Console; **no se presentan como su lista exacta de pistas**, que no ha sido verificada.

No se importa el catálogo completo ni se necesita un almacén externo para estos archivos. La selección añade aproximadamente 27,8 MiB y deja el catálogo activo en 42 pistas.

| Tema | Duración de catálogo | Función propuesta |
| --- | --- | --- |
| Controlled Chaos - no percussion | 5:51 | Investigación y amenaza sin pulso de percusión |
| Controlled Chaos | 5:52 | Presión con percusión, a 80 BPM |
| Long Note Two | 7:42 | Piano irregular y graves, horror contenido |
| Long Note Three | 3:12 | Fondo oscuro para diálogo |
| Gathering Darkness | 4:25 | Extrañeza y peligro electrónico |
| Oppressive Gloom | 3:19 | Drama sombrío y consecuencias |

## Fuentes y derechos

Las fichas oficiales de Incompetech declaran CC BY 4.0 y el crédito de Kevin MacLeod. Cada archivo conserva su título, ISRC, ficha, URL de origen, crédito, modificaciones y huellas SHA-256 en `audio/incompetech-selection.json` y en el catálogo. Los créditos se muestran en la aplicación y en `ATTRIBUTIONS.md`.

Los archivos se han recodificado a MP3 estéreo de 128 kbps, sin recortes de estructura musical. No se confunden con grabaciones de campo ni con síntesis original de Ruido. Sus licencias son independientes de la licencia restrictiva del código.

## Preparación reproducible

```sh
python scripts/prepare-audio.py
python scripts/prepare-dramatic-audio.py
python scripts/prepare-incompetech-selection.py
```

El último script está limitado a seis entradas. Usa las fuentes oficiales y comprueba la huella del original antes de procesar; un archivo distinto exige revisión. Puede reutilizar archivos locales con huella válida. Los originales temporales no forman parte del repositorio. Requiere Python 3 y ffmpeg, además de red para reconstruir archivos no disponibles localmente.

## Reproducción

Estas seis pistas usan `HTMLAudioElement` conectado a ganancias de Web Audio. Los ambientes mantienen los AudioBuffer existentes. El volumen general, el volumen individual, los fundidos y «Parar todo» operan sobre el mismo grafo de salida.

La preparación musical inicia el elemento en silencio dentro del gesto del usuario. La mezcla cambia solo cuando está preparada; un fallo de destino conserva la mezcla anterior y libera las fuentes nuevas. Al confirmar una pista nueva se comienza desde su inicio; las pistas compartidas ya activas mantienen su posición. Parar durante la carga invalida la solicitud y libera su elemento. Se puede reanudar una pausa del navegador mediante otro gesto.

No se precarga el catálogo completo ni se decodifican siete minutos de PCM por pista. Los archivos se sirven desde el mismo origen de Ruido. No se añaden cuentas, servicios, costes de almacenamiento externo ni enlaces directos de reproducción al servidor del compositor.

Las piezas repiten sus versiones completas y conservan los finales originales. No se afirma que todos los finales sean bucles musicales imperceptibles; se debe revisar la escucha y ajustar las uniones en una tarea posterior si resulta necesario.

## Escenas

La selección musical se usa en Investigación, Amenaza cercana, Persecución, Catacumbas y Nave a la deriva. Oppressive Gloom queda disponible en la biblioteca para crear una escena de consecuencias. Se mantienen las ocho escenas de ejemplo; Taberna, Bosque y Combate siguen disponibles. Los identificadores de las 36 pistas previas se conservan para las escenas personales existentes.

## Verificación

- Duración real y estéreo comprobados con ffprobe para los seis archivos.
- Huellas de los MP3 comprobadas contra el manifiesto.
- Crédito original y modificaciones incluidos por pista.
- Pruebas del motor con medios simulados: activación ligada al gesto, carga silenciosa, cancelación, fallos, continuidad de pistas compartidas, ganancias y reanudación.
- La audición en dispositivos reales y las pruebas de los elementos multimedia en Safari/iOS siguen pendientes; las simulaciones no verifican salida física de audio ni comportamiento de red del navegador.
