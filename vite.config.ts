import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Dev server runs at the root ("/") for convenience; the production build and
// `vite preview` are served from the GitHub Pages project-site sub-path "/quiz/"
// (repo: nexlau077/quiz). `mode` is "development" for `vite` dev and "production"
// for `vite build`/`vite preview`, so it cleanly separates the two. asset() reads
// import.meta.env.BASE_URL, so all runtime asset paths follow the active base.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/quiz/' : '/',
  plugins: [react()],
}))
