# Plan de implementación

Estado: fases de implementación 1–6 realizadas y primera versión publicada. La aceptación manual completa sigue pendiente. El detalle siguiente conserva la secuencia de implementación como referencia.

## Próximas tareas

- Activar Enforce HTTPS en GitHub Pages. DNS, dominio personalizado, certificado y recursos de `ruido.briorol.com` ya verificados; detalles en [DOMAIN.md](../DOMAIN.md).
- Escucha real de las 54 pistas y sus uniones; revisar el equilibrio de las 16 escenas.
- Validar diseño, teclado, lector de pantalla y reproducción en escritorio y móvil.
- Comprobar memoria y continuidad de audio en sesiones prolongadas.

Las pruebas automáticas, compilación y publicación de la revisión `11a90b2` han pasado. No se considera cerrada la validación manual del MVP.

## 1. Base del proyecto

- Crear el repositorio `ruido` en la cuenta de GitHub correspondiente y subir estas especificaciones.
- Inicializar TypeScript, React y Vite con comandos de desarrollo, tipos, pruebas y compilación.
- Configurar rutas para GitHub Pages y el flujo de CI.

Salida verificable: aplicación mínima compilable y CI operativo.

## 2. Corte vertical de audio

- Seleccionar y documentar entre dos y cuatro pistas reales con licencia válida.
- Implementar catálogo, carga bajo demanda, bucle, ganancias y reproducción mediante gesto del usuario.
- Implementar detener, retirar y «Parar todo», incluyendo cancelación de cargas.
- Revisar pronto Safari/iOS y los bucles con archivos reales.

Salida verificable: varias pistas suenan juntas y se controlan sin cargas tardías ni duplicados.

## 3. Mezclador y biblioteca

- Construir búsqueda, categorías, controles por pista y volumen general.
- Aplicar límite de pistas, estados de carga, errores y reintentos.
- Completar adaptación a móvil y navegación por teclado.

Salida verificable: AC-01 a AC-08 y AC-17 cubiertos con las pruebas pertinentes.

## 4. Escenas y transiciones

- Implementar almacenamiento versionado y validación de datos.
- Añadir guardar, actualizar, cargar, copiar ejemplos y eliminar escenas.
- Implementar preparación de escena y fundidos interrumpibles con continuidad de pistas compartidas.
- Resolver fallos de almacenamiento, cargas simultáneas y escenas incompatibles.

Salida verificable: AC-09 a AC-16 cubiertos.

## 5. Catálogo y acabado

- Completar la selección de 36 pistas y al menos tres escenas de ejemplo.
- Preparar bucles, niveles, tamaños, créditos y registro de atribuciones.
- Validar memoria, máximo de fuentes, diez minutos de reproducción y compatibilidad.
- Aplicar la identidad visual acordada y revisar accesibilidad.

Salida verificable: catálogo validado y revisión manual documentada.

## 6. Publicación

- Habilitar GitHub Pages y desplegar la compilación mediante Actions.
- Verificar la URL pública, recursos bajo `/ruido/`, reproducción, escenas y créditos.
- Actualizar README con URL, instrucciones reales y limitaciones conocidas.

Salida verificable: definición de terminado satisfecha.

## Regla para cambios

Si una limitación técnica obliga a modificar un comportamiento definido, registrar la decisión y actualizar el requisito y su criterio de aceptación antes de cerrar la tarea. Las funcionalidades fuera del MVP se mantienen fuera hasta acordar ampliar el alcance.
