import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Choose a port that Render expects (e.g., 3000, 5000)
    host: '0.0.0.0', // Ensure the server listens on all network interfaces
  },
})