import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',

  vite: {
    plugins: [tailwindcss()],
  },

  prefetch: {
    prefetchAll: false,
  },

  adapter: cloudflare()
});