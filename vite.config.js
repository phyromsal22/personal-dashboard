import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'Personal Dashboard',
        short_name: 'Dashboard',
        description: 'My Personal Life & Finance Tracker',
        theme_color: '#0F1115', // ពណ៌ផ្ទៃខាងក្រោយ App (Dark Mode)
        background_color: '#0F1115',
        display: 'standalone', // បិទរបារ Browser
        icons: [
          {
            src: '/vite.svg', // ប្រើ Icon លំនាំដើមសិន
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})