import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Plugin to automatically strip unused heavy assets from dist so they are never deployed to Vercel,
// while keeping them 100% intact inside your local public/ directory.
function pruneDistPlugin() {
  return {
    name: 'prune-dist',
    closeBundle() {
      const itemsToPrune = [
        'dist/models/generic_sedan_car.glb',
        'dist/models/generic_sedan_car',
        'dist/materials',
        'dist/ui_references',
      ]
      for (const item of itemsToPrune) {
        const fullPath = path.resolve(__dirname, item)
        if (fs.existsSync(fullPath)) {
          fs.rmSync(fullPath, { recursive: true, force: true })
        }
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pruneDistPlugin()],
  assetsInclude: ['**/*.glb'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-animation': ['gsap', '@gsap/react', 'framer-motion', 'lenis'],
        },
      },
    },
  },
})
