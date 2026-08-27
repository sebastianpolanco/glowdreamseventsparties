import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Update the app in the background and reload to the latest version
      // without the user having to do anything.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Glow Dreams Events',
        short_name: 'Glow Dreams',
        description: 'Glow Dreams Events — experiencias glow a medida. Administra tu sitio desde el móvil.',
        lang: 'es',
        theme_color: '#876be3',
        background_color: '#fefefe',
        display: 'standalone',
        orientation: 'portrait',
        // The installed app is the admin tool: open straight at /admin, which
        // routes to the login screen (or the dashboard if already signed in).
        start_url: '/admin',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache only the app shell + icons. The large hero images and
        // .MOV videos in /public are intentionally left out so the service
        // worker stays small; they load over the network on demand.
        globPatterns: [
          '**/*.{js,css,html,woff,woff2}',
          'favicon.svg',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'apple-touch-icon.png',
        ],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // SPA: any unknown route falls back to index.html (client-side routing,
        // including /admin) — except real static files that must be served as-is
        // (sitemap.xml and robots.txt for crawlers), so the service worker
        // doesn't hand back index.html for them.
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/robots\.txt$/],
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        // Lets you test install/offline behaviour with `npm run dev`.
        enabled: false,
      },
    }),
  ],
  build: {
    // Sin esto el minificador reescribe `@media (max-width: 768px)` como
    // `@media (width <= 768px)` (sintaxis de rangos, Media Queries 4). Los
    // navegadores que no la soportan (Chrome < 104, Safari < 16.4, Samsung
    // Internet < 20) ignoran el bloque entero y la web se ve sin adaptar en
    // el movil. Con un target antiguo se conserva la sintaxis clasica.
    cssTarget: ['chrome87', 'safari13', 'firefox78', 'edge88'],
  },
  server: {
    historyApiFallback: true,
  },
})
