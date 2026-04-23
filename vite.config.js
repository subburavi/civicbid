import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    allowedHosts: ['8906-103-23-29-124.ngrok-free.app'],
  },
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
})
