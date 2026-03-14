// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://itsallgoingtobeok.com',
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
});
