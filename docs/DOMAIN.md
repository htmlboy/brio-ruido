# Dominio de Ruido

## Decisión

- Dominio del proyecto paraguas: `briorol.com`.
- Dirección de Ruido: `https://ruido.briorol.com/`.
- Gestión de DNS prevista: Cloudflare.
- Alojamiento: GitHub Pages, repositorio `htmlboy/brio-ruido`, publicación mediante GitHub Actions.

No se migra el alojamiento a Cloudflare. El subdominio apunta al alojamiento actual.

## Estado

Configurado y verificado el 2026-11-05:

- CNAME público: `ruido.briorol.com` → `htmlboy.github.io`.
- GitHub Pages registra el dominio personalizado y el sitio está publicado.
- Certificado aprobado para `ruido.briorol.com`, con vencimiento informado el 2027-02-03.
- `https://ruido.briorol.com/` devuelve HTTP 200 con validación TLS.
- Los 42 recursos comprobados, incluidos los 36 MP3, responden correctamente por HTTPS.
- **Pendiente: activar Enforce HTTPS en GitHub Pages**. Actualmente HTTP también sirve la página sin redirigir.

Estas comprobaciones verifican entrega de recursos; la escucha e interacción en dispositivos reales se validan por separado.

## Configuración manual

En Cloudflare, zona `briorol.com`, añadir este registro:

| Campo | Valor |
| --- | --- |
| Tipo | CNAME |
| Nombre | `ruido` |
| Destino | `htmlboy.github.io` |
| Proxy | Desactivado: DNS only, nube gris |
| TTL | Auto |

El destino no lleva protocolo, ruta `/ruido/` ni barra final. Si ya existe un registro para el mismo nombre, revisar su propósito antes de sustituirlo; no crear registros en conflicto.

En [GitHub → htmlboy/brio-ruido → Settings → Pages](https://github.com/htmlboy/brio-ruido/settings/pages):

1. En **Custom domain**, escribir `ruido.briorol.com` y guardar.
2. Mantener **Source: GitHub Actions**.
3. Activar **Enforce HTTPS** cuando el certificado esté disponible.

Con el flujo actual de GitHub Actions, añadir un archivo `CNAME` a la compilación no sustituye la configuración de **Custom domain**. Por ello se documenta el ajuste y no se presenta un archivo como si ya hubiera configurado el dominio.

## Verificación posterior

- El CNAME público resuelve a `htmlboy.github.io`.
- Pages registra `ruido.briorol.com` como dominio personalizado.
- HTTPS presenta un certificado válido para el subdominio.
- La portada, JavaScript, CSS y los MP3 cargan desde la raíz del dominio.
- Se pueden cargar escenas y reproducir audio.

## Escenas guardadas

`localStorage` pertenece al origen. Las escenas de `https://htmlboy.github.io` no aparecen automáticamente en `https://ruido.briorol.com`. Exportar una copia JSON desde **Mis escenas** antes del cambio e importarla en el dominio nuevo permite trasladarlas. El formato y los identificadores de pista se conservan.
