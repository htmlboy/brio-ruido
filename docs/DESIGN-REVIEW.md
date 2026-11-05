# Revisión de diseño y biblioteca

## Problemas observados

La primera versión empleaba recursos de una landing promocional dentro de una herramienta: titular grande, eslóganes, onda animada sin relación con el audio, órbitas, ilustraciones por escena, numeración ornamental y mensajes de cierre. Desplazaban las acciones fuera de la primera pantalla y sugerían una app de relajación.

Las tarjetas reservaban más espacio al icono que a identificar y controlar sonidos. En móvil, la mesa vacía se colocaba antes de la biblioteca completa. La biblioteca cubría principalmente lluvia, naturaleza y fondos suaves; faltaban materiales y escenas para amenaza, persecución y conflicto.

No había una skill especializada de diseño instalada. La revisión usa jerarquía de tareas, densidad legible, contraste, consistencia de controles y accesibilidad por teclado como criterios explícitos, sin atribuirla a un preset inexistente.

## Dirección

Ruido es una herramienta de dirección de partidas. La pantalla debe permitir elegir un escenario, localizar una capa, reproducirla y regularla. Identidad sobria: tipografía del sistema, fondo neutro oscuro, acento ámbar limitado a selección y acciones, líneas y espacios para separar grupos. Los iconos identifican acciones; las etiquetas explican qué hacen.

- Retirar el hero, la onda decorativa, los dibujos de escenas y los eslóganes.
- Escenas como botones compactos con nombre, contexto y número de pistas.
- Biblioteca como filas legibles con reproducción, nombre, función y créditos.
- Mezcla visible en escritorio y acceso directo a ella en móvil.
- Controles táctiles de al menos 44 px y deslizadores con nombres accesibles.
- Estados de reproducción expresados también en texto.
- El volumen general y «Parar todo» deben estar disponibles sin recorrer la biblioteca.
- Sin fuentes externas ni animaciones que simulen actividad de audio.

## Biblioteca

Ampliar con capas para tensión, horror y acción, y escenarios de investigación, peligro, persecución y combate. Las nuevas grabaciones deben tener autor, enlace original, licencia y modificaciones verificables. Evitar sustituir contenido dramático por un simple cambio de nombre de pistas tranquilas.

Mantener los identificadores existentes para que las escenas guardadas sigan funcionando. Documentar los nuevos archivos y conservar las licencias independientes del audio. Las adiciones sintetizadas se identifican como síntesis; no se presentan como grabaciones.

## Resultado de esta revisión

La interfaz usa filas de pistas, ocho botones de escenas sin ilustraciones y una mesa de mezcla. El transporte queda fijo al desplazar en escritorio y en la parte inferior en móvil. En móvil la mezcla se abre con un control dedicado, sin ocupar la primera pantalla cuando está vacía. Se eliminan dependencias de Google Fonts.

Se añaden doce pistas: diez composiciones descargadas de OpenGameArt con licencia CC0, CC BY 3.0 u OGA-BY 3.0, y dos capas sintetizadas originales (latido y persecución). La selección inicial de Freesound se descarta porque sus archivos no se pudieron descargar; no se incluyen candidatos sin archivo utilizable. Las fuentes de lanzamiento están en `docs/audio/dramatic-sources.json`.
