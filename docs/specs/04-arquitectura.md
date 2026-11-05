# Arquitectura y datos

Estado: arquitectura implementada; decisiones y cambios en [DECISIONS.md](../DECISIONS.md).

## Plataforma

Aplicación estática sin servidor, cuentas ni secretos. TypeScript, React y Vite, con despliegue de la compilación a GitHub Pages mediante GitHub Actions. Las versiones exactas se fijan en `package-lock.json`.

Los recursos deben funcionar bajo la ruta de proyecto `/ruido/` y bajo la raíz de un futuro dominio. No se usarán rutas absolutas que asuman estar en `/`. El MVP tiene una sola pantalla y no necesita un enrutador.

## Separación de responsabilidades

- Interfaz: biblioteca, mezcla, escenas, créditos y mensajes de estado.
- Estado de aplicación: selección, volúmenes, escena actual y solicitudes pendientes.
- Motor de audio: contexto, fuentes, ganancias, carga, cancelación y transiciones.
- Catálogo: metadatos validados y archivos de audio estáticos.
- Persistencia: lectura, validación y escritura de escenas en `localStorage`.

El motor de audio no depende de los componentes visuales. Los nodos y buffers de audio no se guardan en el estado serializable ni en `localStorage`.

## Datos

Los volúmenes se representan internamente entre 0 y 1. Los tiempos se expresan en segundos.

```ts
type Track = {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  src: string;
  author: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  modifications: string;
  defaultVolume: number;
  kind: "recorded" | "composition" | "synth";
  duration: number;
};

type Scene = {
  id: string;
  name: string;
  tracks: { trackId: string; volume: number }[];
};

type SavedData = {
  schemaVersion: 1;
  masterVolume: number;
  scenes: Scene[];
};
```

Las escenas de ejemplo se distribuyen por separado de los datos del usuario. Se validan identificadores únicos, límites de volumen, ausencia de pistas duplicadas y un máximo de ocho pistas por escena. Los archivos se preparan como bucles completos durante el procesado de audio; el motor repite el buffer completo.

## Concurrencia y fallos

Cada solicitud de carga tiene una identidad o mecanismo equivalente para impedir que una respuesta antigua cambie la mezcla. «Parar todo», retirar una pista o seleccionar otra escena invalidan las solicitudes correspondientes.

La transición solo comienza cuando la escena de destino está preparada y validada. Una carga fallida no sustituye la mezcla actual. Eliminar fuentes y cerrar la aplicación libera recursos; desmontajes y renderizados repetidos no crean reproducciones duplicadas.

## Privacidad y despliegue

No se incorporan analítica, publicidad ni cookies de seguimiento. El alojamiento recibe las solicitudes habituales de página y archivos. No se envían escenas a un servidor.

El flujo de despliegue ejecuta validación de tipos, pruebas relevantes y compilación antes de publicar. El repositorio público es `htmlboy/ruido` y la URL actual es https://htmlboy.github.io/ruido/. El dominio propio `ruido.briorol.com` está definido y pendiente de configuración; su DNS se gestionará en Cloudflare con un CNAME a `htmlboy.github.io`. Al cambiar de origen, las escenas locales se trasladan mediante exportación/importación JSON.
