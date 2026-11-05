# Referencia: Delta Green Audio Console

Fecha de consulta: 2026-11-05.
Estado: investigación y propuestas; no cambia el comportamiento ni los audios publicados de Ruido.
Referencia: https://deltagreen.sorakalden.com/

## Qué está contrastado

El autor de la herramienta, zirus23, describe públicamente:

- Selección por escena y estado de ánimo, con un control de intensidad que hace transiciones a música más tensa.
- Música de Kevin MacLeod / Incompetech bajo CC BY 4.0 en la biblioteca que presenta.
- Efectos y ambientes como radio, estática, lluvia y latidos generados en el navegador, y acentos puntuales superpuestos.
- Una fase de preparación para editar escenas y listas de pistas, separada del uso durante la partida.
- Soporte anunciado para Discord y funcionamiento offline tras preparar los archivos.

Fuentes primarias del autor:

1. [Presentación de la consola y crédito musical](https://www.reddit.com/r/TTRPG/comments/1wybnfw/i_made_a_free_sound_console_for_running_delta/).
2. [Actualización: preparación, personalización, Discord y offline](https://www.reddit.com/r/DeltaGreenRPG/comments/1x1ikui/dg_audio_console_now_supports_discord_and_track/).
3. [Presentación inicial del enfoque por estado de ánimo e intensidad](https://www.reddit.com/r/DeltaGreenRPG/comments/1wxkzj2/made_a_free_immersive_audio_console_for_delta/).

Estas son declaraciones públicas del autor, no resultados de una prueba funcional propia. No se ha confirmado la lista exacta de pistas de la aplicación ni su asignación actual a escenas o intensidades. La inspección directa y la escucha de la herramienta quedan pendientes.

## Qué aporta a Ruido

La principal hipótesis es que una selección musical coherente y controlable aporta más dramatismo que acumular sonidos ambientales genéricos. La dirección propuesta conserva las mezclas de Ruido, pero distingue tres papeles:

1. **Música:** una base dramática que sostiene la escena y evoluciona durante varios minutos.
2. **Ambiente:** capas como lluvia, tráfico o un interior, independientes de la música.
3. **Efecto puntual:** un acento narrativo; no debe repetirse obligatoriamente como un ambiente.

El tercer papel está fuera del MVP actual y necesita una especificación propia antes de implementarse. Tampoco se adopta automáticamente la estética temática, el catálogo, el código, Discord, Spotify o YouTube de la referencia.

## Alcance de incorporación de audio

Incorporar exclusivamente las pistas que aparecen en Delta Green Audio Console y cuya licencia permita su uso con los créditos correspondientes. No importar el catálogo completo de Incompetech ni añadir temas del mismo autor por semejanza de estilo.

La lista exacta de la consola sigue pendiente de verificación. Identificar título y versión de cada pista antes de descargar o incorporarla. Confirmar la ficha oficial y conservar autor, licencia, modificaciones y procedencia. Los títulos sugeridos anteriormente por afinidad musical no constituyen ese inventario y no se consideran seleccionados.

[Incompetech explica su modalidad gratuita con atribución](https://incompetech.com/music/royalty-free/licenses/). La atribución al compositor identifica la fuente general, pero no demuestra qué canciones concretas utiliza la consola.

## Propuestas para especificar después de la audición

### Biblioteca musical cuidada

Preparar una selección pequeña para investigación, amenaza, persecución, horror y consecuencias. Comparar su utilidad bajo voz hablada, evitar cambios de volumen imprevistos y comprobar las uniones o la reproducción consecutiva. La categoría «Música» debe ofrecer contenido identificable y créditos claros, no ocultar las pistas detrás de nombres genéricos.

### Intensidad de escena

Explorar tres niveles, por ejemplo contenido / tensión / peligro, asignados explícitamente a pistas o mezclas curadas. Cambiar de nivel debe tener una transición y conservar los ambientes compartidos. El nivel no equivale a subir el volumen general. Esta función requiere requisitos y criterios de aceptación nuevos; no se da por implementada ni aprobada con esta investigación.

### Preparación frente a uso en partida

Mantener edición y control detallado disponibles al preparar. Durante la partida, facilitar cargar una escena, cambiar su intensidad y parar el sonido sin buscar archivos. Se puede estudiar una vista de sesión sencilla, conservando el mezclador actual para la edición.

## Implicación técnica de música larga

El motor actual decodifica archivos completos en AudioBuffer. Una pista de siete minutos estéreo a 48 kHz puede ocupar unos 154 MiB de PCM, antes de añadir una segunda pista para el fundido y el resto de capas. La compresión del MP3 no reduce ese tamaño una vez decodificado.

Antes de incorporar piezas largas, comparar reproducción mediante HTMLAudioElement conectada al grafo de ganancias con la estrategia actual de buffers. La música larga y los ambientes cortos no necesitan usar la misma estrategia. La decisión debe comprobar inicio en iOS, carga, fundidos, parada, suspensión, memoria y comportamiento de la repetición. No se debe recortar arbitrariamente toda composición a un bucle breve para evitar este trabajo.

## Resultado y límites

La fuente musical y el enfoque narrativo están documentados. No se han añadido audios, copiado assets de la referencia ni cambiado el producto publicado. La siguiente etapa es verificar la lista concreta de la consola y audicionar solo sus pistas reutilizables, además de definir requisitos de intensidad, separando esa decisión de la migración de dominios de Brío.
