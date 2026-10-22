# Carpeta Proyecto · Estudio PWS

Sitio web estático que reproduce, página a página, el PDF **«Estudio PWS - Carpeta Proyecto»** (9 páginas A4): portada, quiénes somos, servicios, desarrollo de sitios web, branding, e-commerce, social media, aplicaciones web y clientes.

Está pensado solo para compartirlo con clientes: lleva `noindex` y un `robots.txt` que bloquea buscadores, y no incluye analítica, cookies ni backend.

## Stack

- [Astro 5](https://astro.build) con salida estática (`dist/`).
- Fuentes autoalojadas con Fontsource: Montserrat Bold, Gothic A1 ExtraBold/Black y Aileron Regular/Bold (licencias OFL y CC0).
- Imágenes optimizadas por Astro (`astro:assets`) a WebP con `srcset`. Las ilustraciones son SVG vectoriales extraídos del PDF.

## Uso

Requiere Node 20.9 o superior.

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # genera el sitio estático en dist/
npm run preview  # sirve dist/ en local para revisarlo
```

## Estructura

```
src/
  pages/index.astro         # las 9 secciones (una por página del PDF)
  layouts/Base.astro        # <head>, fuentes, noindex
  styles/global.css         # maquetación (coordenadas del PDF en escritorio, flujo en móvil)
  assets/fotos/             # fotografías extraídas del PDF
  assets/logos/             # logo de Estudio PWS y logos de clientes
  assets/ilustraciones/     # ilustraciones vectoriales (SVG) extraídas del PDF
public/                     # favicon y robots.txt
docs/BITACORA.md            # decisiones del proyecto
.github/workflows/deploy.yml
```

## Despliegue (Cloudflare Pages)

El sitio se publica en Cloudflare Pages. El único camino de despliegue es GitHub Actions (`.github/workflows/deploy.yml`). El DNS de estudiopws.com sigue en Namecheap, así que el dominio propio es un CNAME hacia Pages (un dominio de Workers exigiría la zona en Cloudflare).

- En cada **pull request** a `main`: `npm ci` + `npm run build`. Si el PR es de este repositorio (no de un fork), además se publica una **preview** con `pages deploy dist --project-name=carpeta-proyecto --branch=<rama del PR>`. La URL y el commit quedan en un comentario del PR. Hace falta el entorno de GitHub `preview` con los secretos `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` (los de `prod` no valen aquí: `prod` solo admite la rama `main`). La URL `*.pages.dev` es pública; el sitio lleva `noindex` y, si se quiere, se puede cerrar con Cloudflare Access.
- En cada **push a `main`** (al fusionar un PR) o lanzándolo a mano (**workflow_dispatch**): el job usa el entorno `prod` y publica `dist/` con `cloudflare/wrangler-action@v3` (`pages deploy dist --project-name=carpeta-proyecto --branch=main`).

El proyecto `carpeta-proyecto` ya existe (Direct Upload, rama de producción `main`). Los secretos de producción están en el GitHub Environment `prod`. Las previews usan el entorno `preview`.

- Producción: https://carpeta-proyecto.pages.dev
- Dominio propio: https://carpeta.estudiopws.com, en cuanto en Namecheap se añada **solo** este registro: CNAME `carpeta` → `carpeta-proyecto.pages.dev`. No modificar los MX, SPF ni DKIM de Private Email.

Quedó conectado desde el panel un Worker temporal (`https://carpeta-proyecto.ezequiel-tejada.workers.dev`). Cuando Pages esté sirviendo el sitio, hay que desconectarlo o eliminarlo en Cloudflare para que cada push a `main` no despliegue dos veces.

Recomendación: como el sitio es solo para clientes, valorar proteger la URL con Cloudflare Access.
