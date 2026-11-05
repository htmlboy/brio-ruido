# Producto y alcance

Estado: especificación vigente. Implementación publicada; comprobaciones manuales pendientes indicadas en [VALIDATION.md](../VALIDATION.md).

## Propósito

Ruido permite a una persona que dirige una partida de rol construir y manejar su ambiente sonoro desde el navegador, sin interrumpir la narración.

El caso principal es una partida presencial o una sesión en la que el usuario ya dispone de un medio para compartir el sonido. La transmisión del audio a otros participantes queda fuera del MVP.

## Principios

- Una acción habitual debe poder hacerse rápidamente y sin abandonar la mezcla.
- El audio debe acompañar la conversación y mantener niveles previsibles.
- Los sonidos deben combinarse y repetirse sin cortes perceptibles.
- El usuario debe poder detener todo inmediatamente.
- El catálogo debe tener procedencia y licencias verificables.

## MVP

- Aplicación estática, inicialmente en español, publicada en GitHub Pages.
- Biblioteca de 36 pistas con licencias documentadas; incluye tensión, horror y acción además de los ambientes cotidianos.
- Categorías, búsqueda por nombre y etiquetas, y filtro por categoría.
- Mezcla de hasta ocho pistas distintas simultáneas.
- Reproducción en bucle, volumen por pista y volumen general.
- Fundidos al activar y desactivar pistas y al cambiar de escena.
- Creación, actualización, carga y eliminación de escenas guardadas localmente.
- Exportación e importación de escenas como copia JSON.
- Escenas de ejemplo para empezar a explorar.
- Información de fuentes y atribuciones accesible desde la aplicación.
- Uso con teclado y diseño adaptable a escritorio y móvil.

## Fuera del MVP

- Cuentas, sincronización entre dispositivos y colaboración en tiempo real.
- Subida de archivos, grabación, exportación de audio y enlaces para compartir escenas.
- Buscadores conectados en directo a Wikimedia Commons o Freesound.
- Generación de audio, secuenciadores, composición musical y sincronización de tempo.
- Botones para efectos puntuales, reproducción aleatoria y automatizaciones narrativas.
- Funcionamiento sin conexión garantizado, pagos y analítica de usuarios.

## Ejemplo de uso

El director abre «Bosque», activa viento y pájaros y ajusta sus volúmenes. Añade lluvia y guarda la combinación como «Bosque bajo la lluvia». Cuando la partida llega al pueblo, carga «Taberna» y los sonidos cambian gradualmente. Puede parar toda la reproducción en cualquier momento.

## Resultado esperado

En una prueba manual, una persona debe poder crear su primera mezcla sin instrucciones externas, guardarla y recuperarla tras recargar la página. No debe necesitar gestionar archivos ni conocer conceptos de edición de audio.

## Decisiones pendientes

- Validación visual e interacción en dispositivos reales; dirección visual definida en [DESIGN-REVIEW.md](../DESIGN-REVIEW.md).
- Escucha de los bucles y escenas en dispositivos reales; catálogo actual de 36 pistas y ocho escenas.
- Configuración de `ruido.briorol.com`: DNS en Cloudflare y alojamiento en GitHub Pages; instrucciones en [DOMAIN.md](../DOMAIN.md).

Las decisiones pendientes no bloquean la estructura del producto ni el trabajo técnico inicial.
