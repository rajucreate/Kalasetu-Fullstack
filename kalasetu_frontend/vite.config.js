import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // The site is served under the `/artisan/` path on Render. Build
  // asset URLs must include that prefix so the browser can fetch them.
  base: '/artisan/',
  plugins: [react()],
})
