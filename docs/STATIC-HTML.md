# HTML estático e hidratación

El build genera la vista inicial de Ruido con React en el servidor de compilación: escenas visibles, buscador, filtros y las 54 pistas de la biblioteca están en el HTML servido. El navegador hidrata ese mismo árbol para activar los controles. No se genera una segunda copia editorial del catálogo.

El render de build no lee localStorage ni crea un AudioContext. La primera vista del navegador coincide con el HTML público; después se recuperan las escenas y el volumen de ese navegador. El guardado queda bloqueado hasta completar esa recuperación, conservando también el bloqueo por datos corruptos. El audio sigue requiriendo interacción.

Las personas y herramientas que no ejecutan JavaScript pueden leer nombres, descripciones y enlaces de atribución. La reproducción, los filtros y el guardado necesitan JavaScript. Un aviso noscript explica ese límite sin ocultar el contenido público.

El bundle temporal de servidor se escribe en `.ssg/`, fuera de Git y del artefacto publicado. Solo `dist/` se publica. Los nombres de pistas, escenas y formatos guardados se mantienen.

Validación: 41 pruebas pasan; HTML leído por HTTP con las 54 filas; navegador sin JavaScript; hidratación sin errores; reproducción y parada; datos previos de escenas/volumen conservados desde la primera escritura tras hidratar.
