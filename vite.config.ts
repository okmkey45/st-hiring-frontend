import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // redirecting to the back end app container on the same network
      // TODOD: review this later to see if "localhost:3000" can be configured instead of "app:3000"
      '/events': 'http://app:3000',
      '/settings': 'http://app:3000',
    },
  },
})
