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
        // including /admin).
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        // Lets you test install/offline behaviour with `npm run dev`.
        enabled: false,
      },
    }),
  ],
  server: {
    historyApiFallback: true,
  },
})
