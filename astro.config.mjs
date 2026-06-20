// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  compressHTML: true,
  site: 'https://gamesname.pages.dev',
  adapter: cloudflare({
    platformProxy: {
      enabled: false,
    },
    imageService: 'passthrough',
    prerenderEnvironment: 'node',
  }),
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      cssCodeSplit: true,
      minify: true,
    },
  },
  trailingSlash: 'ignore',
});
