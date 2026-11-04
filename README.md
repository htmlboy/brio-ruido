# Ruido

**Ambientes para tus historias.**

[Abre Ruido](https://htmlboy.github.io/ruido/) · [Especificaciones](docs/specs/01-producto.md) · [Créditos de audio](ATTRIBUTIONS.md)

Ruido es una herramienta web para crear paisajes sonoros combinando pistas de audio en bucle. Mezcla lluvia, viento, naturaleza, calles, multitudes y fondos musicales para dar ambiente a tus partidas de rol.

Cada pista tiene su propio volumen y puede activarse o detenerse de forma independiente. Guarda tus combinaciones como escenas y cambia entre ellas con transiciones suaves, siguiendo el ritmo de la historia.

## Primera versión

Primera versión publicada en **https://htmlboy.github.io/ruido/**. Las pruebas y la compilación se ejecutan también en GitHub Actions.

- 24 pistas alojadas con la aplicación: 12 grabaciones abiertas y 12 capas de síntesis original, incluidas cuatro bases musicales.
- Seis escenas de ejemplo y mezclas de hasta ocho pistas.
- Búsqueda, categorías, volumen por pista y volumen general.
- Cambios de escena con fundido de dos segundos, manteniendo las pistas compartidas.
- Escenas guardadas en el navegador, con exportación e importación de copias JSON.
- Interfaz en español, adaptable a móvil y con controles de teclado.
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

La compilación estática queda en `dist/` y usa rutas relativas, compatibles con `/ruido/` y con un dominio propio. El flujo `.github/workflows/pages.yml` comprueba tipos, pruebas y compilación antes de desplegar a GitHub Pages.

## Audio y licencias

Las grabaciones proceden del catálogo de [Blanket](https://github.com/rafaelmardojai/blanket), con sus fuentes originales y licencias independientes documentadas en [ATTRIBUTIONS.md](ATTRIBUTIONS.md). Se incluyen CC0, dominio público y CC BY. Se han preparado extractos mono, niveles y uniones con fundido cruzado. El código de Blanket no se incorpora al proyecto.

Las doce capas sintéticas originales se publican bajo CC0. Para reconstruir el catálogo desde las fuentes se necesita Python 3, NumPy, ffmpeg y acceso de red:

```sh
python scripts/prepare-audio.py
```

La revisión de Blanket está fijada en `scripts/blanket-revision.txt`; la procedencia y las huellas de los originales están en `src/catalog.json`.

## Especificaciones

1. [Producto y alcance](docs/specs/01-producto.md)
2. [Experiencia y requisitos funcionales](docs/specs/02-experiencia.md)
3. [Audio y catálogo](docs/specs/03-audio-y-catalogo.md)
4. [Arquitectura y datos](docs/specs/04-arquitectura.md)
5. [Criterios de aceptación](docs/specs/05-aceptacion.md)
6. [Plan de implementación](docs/specs/06-plan.md)
7. [Decisiones y validación de la primera versión](docs/VALIDATION.md)

## Licencia

Código, documentación e interfaz originales: **todos los derechos reservados**. El repositorio público no concede permiso de reutilización, modificación, redistribución ni uso comercial. El uso personal de la web oficial está permitido. Consulta [LICENSE](LICENSE).

Los audios y las dependencias conservan sus licencias respectivas; consulta [ATTRIBUTIONS.md](ATTRIBUTIONS.md). Las versiones del código distribuidas previamente bajo MIT conservan los permisos ya concedidos.
