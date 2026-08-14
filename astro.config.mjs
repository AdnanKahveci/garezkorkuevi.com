import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://garezkorkuevi.com',
  output: 'static',
  integrations: [sitemap()],
  build: {
    assets: 'assets',
    format: 'directory',
    inlineStylesheets: 'always',
  },
  compressHTML: true,
});
