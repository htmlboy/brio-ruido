# Importación de Incompetech

## Estado

Se ha inventariado el catálogo oficial consultado el 2026-11-05: 1.443 pistas, 87,1 horas, sin entradas descartadas por metadatos inválidos. **El inventario no equivale a haber descargado todos los archivos ni a tenerlos publicados en Ruido.** La biblioteca reproducible de la aplicación sigue siendo la actual de 36 pistas.

El inventario está en `audio/incompetech-catalog.json`. Conserva título, ISRC, duración, instrumentos, estados de ánimo, créditos, ficha oficial y enlace de descarga de cada tema. No copia las descripciones creativas completas del compositor.

No se conoce la lista exacta de la consola de Delta Green. El catálogo de Incompetech no debe presentarse como si fuera esa selección.

## Derechos de la fuente

La ficha oficial usa un catálogo JSON y declara CC BY 4.0 en el bloque de atribución de las pistas. Se conservan la URL y huella de esa evidencia y del catálogo consultado. Cada entrada incluye el crédito de Kevin MacLeod, el enlace de origen y la licencia. El importador comprueba la plantilla de licencia al actualizar la fuente y falla si cambia, para permitir una nueva revisión antes de descargar.

Fuentes:

- [Catálogo de datos oficial](https://incompetech.com/music/royalty-free/pieces.json).
- [Ficha y atribución de Controlled Chaos](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1200059).
- [Licencias de Incompetech](https://incompetech.com/music/royalty-free/licenses/).
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Se usa la modalidad Creative Commons con atribución, sin adquirir licencias comerciales sin atribución. La licencia restrictiva del código no se aplica a estos audios. Ningún token ni dato personal es necesario para obtener los archivos públicos.

## Herramienta

Requisitos: Python 3, ffmpeg y ffprobe. No necesita paquetes Python externos.

Actualizar únicamente el inventario:

```sh
python scripts/import-incompetech.py --refresh
```

Descargar un tema por su ISRC y conservarlo completo, recodificado a estéreo 128 kbps:

```sh
python scripts/import-incompetech.py --download --transcode --isrc USUAN1200059
```

Seleccionar todo el catálogo de forma explícita con un presupuesto de archivos:

```sh
python scripts/import-incompetech.py --download --all --transcode --max-bytes 5500000000
```

El último comando prepara medios localmente; no publica automáticamente en GitHub ni crea un bucket. Sin `--transcode` se conserva el archivo original, que puede ocupar bastante más. La selección por ISRC permite usar la lista de una consola o una selección concreta sin limitar el inventario completo.

Los audios se guardan en `.local/incompetech/`, excluido de Git. Cada archivo tiene un recibo JSON con fuente, hashes, tamaño, crédito y modificaciones; el lote genera también `ATTRIBUTIONS.md`. Los recibos válidos permiten omitir archivos ya completados al reanudar. Se comprueban el origen de descarga, los nombres, la duración real y el espacio disponible. El presupuesto evita ocupar el disco sin límite. Los errores se detienen para su revisión; no se eluden restricciones de acceso.

## Descarga piloto verificada

Se han obtenido completos, sin recortar su estructura musical:

- Long Note Two.
- Long Note Three.
- Gathering Darkness.
- Oppressive Gloom.
- Controlled Chaos.
- Controlled Chaos - no percussion.

El lote piloto ocupa aproximadamente 27,8 MiB a 128 kbps estéreo. Cada fuente se ha comprobado mediante ffprobe y sus recibos conservan los hashes del original y el resultado. Esto no equivale a una audición completa ni a una prueba de reproducción en navegador.

## Alojamiento y reproducción pendientes

El catálogo completo rondaría 5 GB a 128 kbps, antes de pequeñas diferencias de codificación y etiquetas. Los originales ocuparían más. Los archivos no deben incorporarse masivamente al repositorio de la aplicación ni confundirse con su inventario de metadatos.

Preparar almacenamiento de audio separado, por ejemplo Cloudflare R2. Antes de publicar: definir el bucket y su dominio, permitir CORS para el origen real de Ruido si el audio se conecta a Web Audio, comprobar solicitudes por rangos, tipos MIME, caché y atribuciones. No hay un bucket configurado ni una URL de medios activa en esta propuesta.

Para música de varios minutos, evaluar reproducción con HTMLAudioElement conectada al grafo de ganancias. El motor actual decodifica buffers completos y no debe recibir 1.443 temas ni varias piezas largas sin revisar su consumo de memoria. La aplicación debe cargar solo las pistas elegidas, nunca precargar el catálogo completo.

## Validación

Seis pruebas Python sin red comprueban la integridad del inventario y de los créditos, la identidad y duración de los temas, el rechazo de nombres de archivo inseguros, los metadatos opcionales y el aislamiento de los archivos respecto a `public/` y Git. Se incorporan al flujo de comprobación de GitHub Actions. La descarga piloto se verificó contra los archivos reales.
