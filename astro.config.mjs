// @ts-check
import { defineConfig } from 'astro/config';

// Sitio 100 % estático: `npm run build` genera la carpeta dist/.
export default defineConfig({
  output: 'static',
  build: { inlineStylesheets: 'auto' },
});
