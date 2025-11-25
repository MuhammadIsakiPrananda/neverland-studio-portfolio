/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5701,
    strictPort: true,
    proxy: {
      // Teruskan semua permintaan yang dimulai dengan /api ke server backend
      '/api': {
        target: 'http://localhost:5000', // Alamat backend Anda
        changeOrigin: true, // Diperlukan untuk virtual host
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    setupFiles: './src/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
