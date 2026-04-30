import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // The Render site is published from the frontend dist root.
  // Keep asset URLs root-relative so /assets/* resolves correctly.
  base: '/',
  plugins: [react()],
})
