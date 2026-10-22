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

El workflow `.github/workflows/deploy.yml`:

- En cada **pull request** a `main`: solo `npm ci` + `npm run build` (comprobación, sin desplegar).
- En cada **push a `main`** (es decir, al fusionar un PR) o lanzándolo a mano (**workflow_dispatch**): compila y publica `dist/` en Cloudflare Pages con `cloudflare/wrangler-action@v3` (`pages deploy dist --project-name=carpeta-proyecto --branch=main`).

Hasta que se configure lo siguiente, el job de despliegue fallará (el build de PR sí funciona). Configuración pendiente (la hace Teja):

1. **Proyecto de Pages**: en Cloudflare → *Workers & Pages* → *Create* → *Pages* → *Direct Upload*, crear un proyecto llamado `carpeta-proyecto`. (También puede dejarse que wrangler lo cree en el primer despliegue, si el token tiene permisos.)
2. **API token**: en Cloudflare → *My Profile* → *API Tokens* → *Create Token* → plantilla personalizada con el permiso **Account · Cloudflare Pages · Edit**, limitado a la cuenta del estudio.
3. **Secretos del entorno `prod`** (GitHub → *Settings* → *Environments* → `prod`; ya configurados por Teja el 22/10/2026):
   - `CLOUDFLARE_API_TOKEN`: el token del paso 2.
   - `CLOUDFLARE_ACCOUNT_ID`: el *Account ID* (aparece en la portada del panel de Cloudflare).

Recomendación: como el sitio es solo para clientes, valorar proteger la URL con Cloudflare Access.
