# Criterios de aceptación

Estado: contrato inicial de validación del MVP.

## Casos funcionales

| ID | Caso | Resultado esperado |
| --- | --- | --- |
| AC-01 | Abrir o recargar | No suena audio; se muestran biblioteca y escenas válidas. |
| AC-02 | Buscar «lluvia» y filtrar clima | Solo aparecen coincidencias de ambos criterios; mayúsculas y acentos no cambian el resultado. |
| AC-03 | Activar dos pistas | Ambas suenan en bucle y sus controles actúan de forma independiente. |
| AC-04 | Activar una pista ya seleccionada | No se duplica. |
| AC-05 | Añadir una novena pista | Se mantiene la mezcla y aparece una explicación del límite. |
| AC-06 | Detener y reactivar una pista | Conserva su volumen y comienza desde el inicio al reactivarse. |
| AC-07 | Cambiar volumen general | Cambia la salida sin modificar los valores individuales. |
| AC-08 | Parar todo durante una carga o transición | La salida se silencia en hasta 50 ms desde que el motor procesa la acción; ninguna carga pendiente vuelve a sonar. |
| AC-09 | Guardar y recargar | La escena conserva nombre, pistas y volúmenes; no se reproduce automáticamente. |
| AC-10 | Actualizar una escena | Solo se sobrescribe mediante la acción explícita; editar la mezcla no basta. |
| AC-11 | Eliminar una escena | Se solicita confirmación y el audio actual continúa. |
| AC-12 | Cambiar entre escenas | Se aplica un fundido de 2 s; las pistas compartidas no se reinician. |
| AC-13 | Elegir varias escenas rápidamente | Solo la última solicitud puede aplicarse; no quedan fuentes huérfanas. |
| AC-14 | Fallar una pista de la escena de destino | La mezcla anterior continúa y se ofrece reintentar. |
| AC-15 | Bloquear almacenamiento | Se puede mezclar; se informa de que los cambios no se han guardado. |
| AC-16 | Cargar datos corruptos o una escena incompatible | La aplicación abre, explica el problema y no borra ni reproduce parcialmente los datos afectados. |
| AC-17 | Usar solo teclado | Todas las acciones son alcanzables y el foco es visible. |
| AC-18 | Abrir desde `/brio-ruido/` | Interfaz, audio y créditos cargan sin rutas rotas. |
| AC-19 | Consultar una pista | Se puede acceder a su autor, fuente, licencia y modificaciones. |

## Ilustraciones de escenas

| ID | Caso | Resultado esperado |
| --- | --- | --- |
| AC-20 | Explorar escenas de ejemplo | Cada escena tiene una ilustración distinta y mantiene su nombre textual. |
| AC-21 | Elegir imagen al guardar y exportar/importar | Se conserva el identificador de ilustración junto con las pistas y sus volúmenes. |
| AC-22 | Abrir una escena antigua o con imagen desconocida | Se muestra una imagen neutra; la escena y sus pistas se conservan. |
| AC-23 | Cambiar imagen de una escena existente | Solo cambia su ilustración; no se alteran pistas, volúmenes ni reproducción. |
| AC-24 | Usar el selector con teclado | Se puede elegir mediante radios nativos con etiquetas y foco visibles. |

## Revisión de audio y dispositivo

- Cada pista supera una escucha de tres bucles sin cortes o chasquidos perceptibles en la unión.
- Las escenas de ejemplo no presentan saturación audible y permiten mantener una conversación ajustando el volumen general.
- Una mezcla de ocho pistas funciona durante diez minutos sin interrupciones en un equipo de escritorio y un móvil de referencia, que se documentarán al validar.
- Se revisan la transición de máxima concurrencia, la memoria de buffers y la liberación de recursos al retirar pistas.
- La interfaz sigue siendo utilizable a 360 px de ancho y con ampliación del 200 %.
- Se registran navegador, versión y dispositivo de las pruebas de compatibilidad; los fallos conocidos se documentan antes de publicar.

## Estrategia de pruebas

Automatizar validación del catálogo y escenas, persistencia, límites y cancelación de solicitudes. Probar con integración las transiciones y la interacción entre estado y motor. Añadir pruebas de navegador para crear/recuperar una escena, fallos de carga y rutas de despliegue.

Las pruebas simuladas del motor no acreditan la calidad del audio: bucles, niveles, compatibilidad y escucha se verifican también manualmente con los archivos reales.

## Definición de terminado

El MVP se considera terminado cuando los casos anteriores pasan, no quedan errores bloqueantes conocidos, todas las pistas tienen licencia documentada y la compilación publicada en GitHub Pages supera una comprobación de reproducción, persistencia y créditos.
