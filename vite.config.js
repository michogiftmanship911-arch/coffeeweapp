import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The 3D stack is lazy-loaded (see CupStage.jsx), so these chunks only download
// when a page that shows a 3D cup is opened.
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
