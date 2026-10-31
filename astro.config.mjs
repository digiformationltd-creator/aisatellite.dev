import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://aisatellite.dev',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/workspace') &&
        !page.includes('/community/moderation') &&
        !page.includes('/operations-admin') &&
        !page.includes('/growth-admin') &&
        !page.includes('/research-admin') &&
        !page.includes('/reliability-admin') &&
        !page.includes('/launch-admin'),
    }),
  ],
  vite: {
    ssr: {
      noExternal: ['lucide-react', 'three'],
    },
  },
});
