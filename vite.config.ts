import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<owner>.github.io/tony-music/ as a GitHub Pages project site
  base: '/tony-music/',
  devtools: {
    // Remove this `apply` property to enable devtools for build as well
    apply: 'serve',
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: '王八音盒',
        short_name: '王八音盒',
        description: 'A fast, installable music web app.',
        theme_color: '#ffffff',
        background_color: '#08060d',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '.',
        scope: '.',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/tony-music/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Song MP3s never change, so cache each one on first play and
            // serve it from the CacheFirst 'songs-v1' cache forever after.
            // 'rangeRequests' lets the <audio> element still seek/scrub
            // (Workbox strips the Range header on the one network fetch so
            // the full file gets cached, then answers later range requests
            // from the cached copy).
            urlPattern: /raw.githubusercontent\.com\/qweasd1\/tony-music\/.*\/data\/songs\/[^/]+\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'songs-v1',
              cacheableResponse: { statuses: [0, 200] },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
