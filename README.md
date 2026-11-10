# Ruido

**Ambientes para tus historias.**

[Abre Ruido](https://ruido.briorol.com/) · [Especificaciones](docs/specs/01-producto.md) · [Créditos de audio](ATTRIBUTIONS.md)

Ruido es una herramienta web para crear paisajes sonoros combinando pistas de audio en bucle. Mezcla lluvia, viento, naturaleza, calles, multitudes y fondos musicales para dar ambiente a tus partidas de rol.

Cada pista tiene su propio volumen y puede activarse o detenerse de forma independiente. Guarda tus combinaciones como escenas y cambia entre ellas con transiciones suaves, siguiendo el ritmo de la historia.

## Primera versión

Primera versión publicada en **https://ruido.briorol.com/**. Las pruebas y la compilación se ejecutan también en GitHub Actions.

- 54 pistas alojadas con la aplicación: grabaciones, composiciones de terceros y capas de síntesis original.
- Categorías de tensión, horror y acción: percusión de guerra, cuerdas disonantes, piano y coro, drones y fondos postapocalípticos.
- Ilustraciones para reconocer las escenas y 16 imágenes seleccionables para las mezclas guardadas.
- 16 escenas de tensión, aventura y ambiente cotidiano, filtrables por tono. Mezclas de hasta ocho pistas.
- Búsqueda, categorías, volumen por pista y volumen general.
- Cambios de escena con fundido de dos segundos, manteniendo las pistas compartidas.
- Escenas guardadas en el navegador, con exportación e importación de copias JSON.
- Interfaz funcional en español: sonidos en filas, escenas compactas y controles generales siempre accesibles. Adaptable a móvil y con controles de teclado.
- Sin cuentas ni servidor de aplicación.

Las escenas se guardan en este navegador; al borrar sus datos se pierden. Exporta una copia desde «Mis escenas» si quieres conservarlas. No se reproduce audio al abrir la página. El navegador puede suspender el sonido en segundo plano o al bloquear el dispositivo.

## Desarrollo

Requiere Node.js 24 y npm.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
```

La compilación estática queda en `dist/` y usa rutas relativas, compatibles con `/brio-ruido/` y con un dominio propio. El flujo `.github/workflows/pages.yml` comprueba tipos, pruebas y compilación antes de desplegar a GitHub Pages.

## Audio y licencias

Las grabaciones proceden del catálogo de [Blanket](https://github.com/rafaelmardojai/blanket), con sus fuentes originales y licencias independientes documentadas en [ATTRIBUTIONS.md](ATTRIBUTIONS.md). Se incluyen CC0, dominio público y CC BY. Se han preparado extractos mono, niveles y uniones con fundido cruzado. El código de Blanket no se incorpora al proyecto.

Se incluyen 18 composiciones completas de Kevin MacLeod / Incompetech bajo CC BY 4.0, con créditos y procedencia por pista. Esta selección acotada no representa la lista exacta de Delta Green Audio Console. Detalle en [MUSIC-SELECTION.md](docs/MUSIC-SELECTION.md).

Las capas sintéticas originales se publican bajo CC0. La biblioteca dramática incorpora diez composiciones de [OpenGameArt](https://opengameart.org/) bajo CC0, CC BY 3.0 y OGA-BY 3.0. Las atribuciones y la evidencia de licencia se conservan por archivo en [docs/audio/dramatic-sources.json](docs/audio/dramatic-sources.json). Para reconstruir el catálogo desde las fuentes se necesita Python 3, NumPy, ffmpeg y acceso de red:

```sh
python scripts/prepare-audio.py
python scripts/prepare-dramatic-audio.py
python scripts/prepare-incompetech-selection.py
```

La revisión de Blanket está fijada en `scripts/blanket-revision.txt`; la procedencia y las huellas de los originales están en `src/catalog.json`.

## Especificaciones

1. [Producto y alcance](docs/specs/01-producto.md)
2. [Experiencia y requisitos funcionales](docs/specs/02-experiencia.md)
3. [Audio y catálogo](docs/specs/03-audio-y-catalogo.md)
4. [Arquitectura y datos](docs/specs/04-arquitectura.md)
5. [Criterios de aceptación](docs/specs/05-aceptacion.md)
6. [Plan de implementación](docs/specs/06-plan.md)
7. [Decisiones y validación](docs/VALIDATION.md)
8. [Revisión de diseño y biblioteca](docs/DESIGN-REVIEW.md)
9. [Registro de decisiones](docs/DECISIONS.md)
10. [Configuración de ruido.briorol.com](docs/DOMAIN.md)
11. [Ilustraciones de escenas](docs/SCENE-ART.md)
12. [Selección musical y reproducción](docs/MUSIC-SELECTION.md)

## Licencia

Código, documentación e interfaz originales: **todos los derechos reservados**. El repositorio público no concede permiso de reutilización, modificación, redistribución ni uso comercial. El uso personal de la web oficial está permitido. Consulta [LICENSE](LICENSE).

Los audios y las dependencias conservan sus licencias respectivas; consulta [ATTRIBUTIONS.md](ATTRIBUTIONS.md). Las versiones del código distribuidas previamente bajo MIT conservan los permisos ya concedidos.

## HTML público

El build incluye la biblioteca inicial en el HTML servido y React hidrata sus controles. Los lectores sin JavaScript pueden consultar las pistas; la reproducción y el guardado requieren JavaScript. Las escenas y el volumen de cada navegador se restauran después de hidratar, antes de persistir cambios. Detalles y comprobaciones en [docs/STATIC-HTML.md](docs/STATIC-HTML.md).
