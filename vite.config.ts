import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` MUST match the GitHub Pages project-site path so all asset URLs resolve.
export default defineConfig({
  base: '/pawa-birtday/',
  plugins: [react()],
})
