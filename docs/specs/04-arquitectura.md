# Arquitectura y datos

Estado: propuesta técnica inicial.

## Plataforma

Aplicación estática sin servidor, cuentas ni secretos. Propuesta: TypeScript, React y Vite, con despliegue de la compilación a GitHub Pages mediante GitHub Actions. Las versiones y dependencias se fijarán al iniciar la implementación.

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
  category: string;
  tags: string[];
  src: string;
  author: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  modifications: string;
  defaultVolume: number;
  loopStart?: number;
  loopEnd?: number;
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

Las escenas de ejemplo se distribuyen por separado de los datos del usuario. Se validan identificadores únicos, límites de volumen, ausencia de pistas duplicadas y un máximo de ocho pistas por escena. Los puntos de bucle deben estar dentro de la duración decodificada y el final debe ser posterior al inicio.

## Concurrencia y fallos

Cada solicitud de carga tiene una identidad o mecanismo equivalente para impedir que una respuesta antigua cambie la mezcla. «Parar todo», retirar una pista o seleccionar otra escena invalidan las solicitudes correspondientes.

La transición solo comienza cuando la escena de destino está preparada y validada. Una carga fallida no sustituye la mezcla actual. Eliminar fuentes y cerrar la aplicación libera recursos; desmontajes y renderizados repetidos no crean reproducciones duplicadas.

## Privacidad y despliegue

No se incorporan analítica, publicidad ni cookies de seguimiento. El alojamiento recibe las solicitudes habituales de página y archivos. No se envían escenas a un servidor.

El flujo de despliegue ejecuta validación de tipos, pruebas relevantes y compilación antes de publicar. La publicación efectiva y la configuración del repositorio se realizarán en una fase posterior; estos documentos no afirman que ya existan.
