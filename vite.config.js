import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/ns-trip-analyzer/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'NS Trip Analyzer',
        short_name: 'NS Trips',
        description: 'Analyze your NS train trips and travel costs',
        theme_color: '#0a0e1a',
        background_color: '#0a0e1a',
        display: 'standalone',
        icons: [
          {
            src: 'ns-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'ns-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'ns-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
    }),
  ],
})
