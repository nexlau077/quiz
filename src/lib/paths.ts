// Single source of truth for resolving asset URLs.
// Every runtime asset path is prefixed with import.meta.env.BASE_URL (the Vite
// `base`, "/" here) so assets resolve no matter where the site is served from.
// Absolute URLs (http/https/data/blob) are passed through untouched.
const ABSOLUTE = /^(?:[a-z]+:)?\/\//i

export function asset(path?: string): string | undefined {
  if (!path) return undefined
  if (ABSOLUTE.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }
  const base = import.meta.env.BASE_URL // "/" (Vite `base`)
  const clean = path.replace(/^\/+/, '')
  return `${base}${clean}`
}
