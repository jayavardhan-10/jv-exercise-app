import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
    allowedHosts: ['jv-exercise-frontend.onrender.com', '.onrender.com']
  },
  define: {
    // Make sure environment variables are properly exposed
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  }
})
