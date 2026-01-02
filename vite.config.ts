import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip compression - hanya file besar
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files > 10kb
      deleteOriginFile: false,
      verbose: false
    }),
    // Brotli compression (lebih efisien dari gzip)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
      verbose: false
    }),
    // Bundle analyzer (akan membuat stats.html)
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    })
  ],
  build: {
    // Optimasi build output
    target: 'es2015',
    minify: 'terser',
    cssMinify: true,
    sourcemap: false, // Disable source maps di production untuk ukuran lebih kecil
    rollupOptions: {
      output: {
        // Chunk size limits untuk better loading
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          // Vendor chunks untuk better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('recharts') || id.includes('chart.js')) {
              return 'chart-vendor';
            }
            if (id.includes('axios')) {
              return 'http-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
          // Dashboard components di-chunk terpisah
          if (id.includes('/components/dashboard/')) {
            return 'dashboard';
          }
        }
      }
    },
    // Terser options untuk minification optimal
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log di production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2
      },
      format: {
        comments: false // Remove comments
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Optimasi dependencies pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    exclude: ['@vite/client', '@vite/env']
  },
  // Server options untuk development
  server: {
    port: 3000,
    host: true,
    hmr: {
      overlay: true
    }
  },
  // Preview server
  preview: {
    port: 4173,
    host: true
  }
})
