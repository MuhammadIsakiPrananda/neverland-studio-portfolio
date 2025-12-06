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
      // Aturan ini meneruskan semua permintaan dari frontend yang dimulai dengan '/api'
      // ke server backend Anda di http://localhost:5000.
      // Contoh: request ke '/api/auth/register' akan diteruskan ke 'http://localhost:5000/api/auth/register'
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
