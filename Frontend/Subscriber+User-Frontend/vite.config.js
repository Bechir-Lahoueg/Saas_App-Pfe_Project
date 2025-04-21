import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1.nip.io',
    port: 5173,
    strictPort: true,  // fail if 5173 is in use
    cors: true,
    // Allow any host (you can restrict to *.nip.io if you like)
    // "allow" is only needed in Vite 4+. If yours is older, just host:true is enough.
    allowedHosts: [
      '.127.0.0.1.nip.io'
    ]
    }
})
