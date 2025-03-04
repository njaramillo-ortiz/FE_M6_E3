import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        short_name: 'HospitalApp',
        name: 'Nursing Hospital',
        description: 'Aplicación web progresiva para el hospital.',
        icons: [
          {
            src: 'icon-192x192.png', 
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png', 
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#007bff',
      },
      includeAssets: [
        '/icon-192x192.png', 
        '/icon-512x512.png',
      ],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'], 
      },
    }),
  ],
  server: {
    open: false, 
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});
