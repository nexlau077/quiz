import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Served from the domain root ("/"). On GitHub Pages this resolves only for a
// user/org site (<username>.github.io) or a custom domain; a project-site repo is
// served under "/<repo>/" and would need that string as `base` instead.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
