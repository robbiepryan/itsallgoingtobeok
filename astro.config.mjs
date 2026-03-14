// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
// Astro 6: output 'static' is the default and supports per-page SSR
// via `export const prerender = false`. The adapter enables SSR routes.
export default defineConfig({
  site: 'https://itsallgoingtobeok.com',
  adapter: cloudflare(),
  build: {
    inlineStylesheets: 'always',
  },
});
