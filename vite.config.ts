/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Production build optimizations
  build: {
    target: "es2015",
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false, // Disable sourcemaps in production
    minify: "esbuild", // Fast minification
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Code splitting for better caching
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "react-vendor";
            }
            if (
              id.includes("framer-motion") ||
              id.includes("lucide-react") ||
              id.includes("recharts")
            ) {
              return "ui-vendor";
            }
            if (id.includes("zod") || id.includes("axios")) {
              return "form-vendor";
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 1MB warning limit
    cssCodeSplit: true,
    reportCompressedSize: false, // Faster builds
  },

  server: {
    port: 5701,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    setupFiles: "./src/setup.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
