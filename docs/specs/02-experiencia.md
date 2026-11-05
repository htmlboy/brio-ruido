# Experiencia y requisitos funcionales

Estado: especificación vigente. Implementación publicada; comprobaciones manuales pendientes indicadas en [VALIDATION.md](../VALIDATION.md).

## Pantalla principal

La interfaz presenta biblioteca, mezcla activa y escenas guardadas. El volumen general y el botón «Parar todo» permanecen accesibles mientras se usa la mezcla. En escritorio la biblioteca se muestra en filas junto a la mezcla. En móvil, el transporte permanece en la parte inferior y su botón «Mezcla» abre el panel de pistas. Los controles esenciales no dependen de pasar el cursor.

## Biblioteca — RF-01

Cada pista muestra nombre, categoría y acción de activación. La búsqueda ignora mayúsculas y acentos y combina nombre y etiquetas; el filtro de categoría se aplica conjuntamente. Una búsqueda sin resultados ofrece una forma de limpiar los filtros.

Activar una pista ya presente no crea una copia. Si hay ocho pistas seleccionadas, se explica el límite y se pide retirar una antes de añadir otra. Las pistas seleccionadas, aunque estén detenidas, cuentan para este límite.

## Mezcla — RF-02

Cada pista seleccionada ofrece reproducir/detener, volumen entre 0 y 100 y retirar de la mezcla. Estados visibles: cargando, reproduciendo, detenida y error. Los estados también se expresan mediante texto o nombres accesibles.

Una pista nueva comienza con un volumen recomendado por el catálogo. La activación carga y reproduce el audio, siempre dentro de una interacción autorizada por el navegador. Mientras carga se puede cancelar su activación.

Detener conserva la pista y su volumen en la mezcla. Volver a reproducir comienza desde el inicio. Retirar libera la pista y su recurso de audio una vez terminado el fundido. No se muestra un control de posición.

## Controles generales — RF-03

El volumen general modifica la salida sin alterar los volúmenes individuales. «Parar todo» cancela cargas pendientes y transiciones, silencia la salida con una rampa breve y deja todas las pistas detenidas. Conserva la composición y sus volúmenes. Ninguna carga tardía puede reanudar el sonido.

No se reproduce audio al abrir ni al recargar la aplicación.

## Escenas — RF-04

Una escena guarda nombre, identificadores de pistas y volúmenes individuales. Todas las pistas incluidas se reproducen al cargarla. No guarda la posición del audio, el estado detenido de cada pista ni el volumen general.

- «Guardar como escena» crea una escena desde la mezcla seleccionada, con nombre obligatorio de 1 a 60 caracteres tras eliminar espacios exteriores.
- No se puede guardar una escena vacía.
- Los nombres duplicados se permiten; la identidad depende de un identificador estable.
- «Actualizar escena» guarda la mezcla en la escena seleccionada mediante una acción explícita.
- Cambiar una mezcla nunca sobrescribe automáticamente una escena.
- Eliminar una escena requiere confirmación; no altera el sonido actual.
- Las escenas de ejemplo se pueden cargar y guardar como copia, pero no sobrescribir ni eliminar.

Al cargar una escena se prepara su audio antes de cambiar la mezcla. Si alguna pista falla, se conserva la mezcla anterior y se ofrece reintentar. Durante la preparación se puede cancelar; al elegir otra escena, solo la última solicitud puede aplicarse.

## Persistencia y errores — RF-05

Las escenas del usuario y el volumen general se guardan en el navegador. La aplicación explica que estos datos pertenecen al navegador y pueden perderse al borrar sus datos. La mezcla de trabajo sin guardar no se recupera al recargar.

Si el almacenamiento está bloqueado o lleno, la mezcla sigue funcionando y se informa de que los cambios no se han guardado. Los datos guardados inválidos no deben impedir abrir la aplicación ni sobrescribirse silenciosamente.

Una pista que falla muestra un error y una acción para reintentar; no detiene las demás. Las escenas con pistas ausentes del catálogo se marcan como incompatibles y no se cargan parcialmente.

## Accesibilidad — RF-06

Todas las acciones funcionan con teclado, muestran foco visible y tienen nombres accesibles. Los deslizadores anuncian su pista y valor. Los cambios de carga o error se anuncian sin bombardear al lector de pantalla. Se busca contraste WCAG AA y se respeta la preferencia de movimiento reducido para animaciones visuales.
