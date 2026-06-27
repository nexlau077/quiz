// Single source of truth for resolving asset URLs.
// On GitHub Pages the site lives under a sub-path (e.g. /pawa-birtday/), so every
// runtime asset path must be prefixed with import.meta.env.BASE_URL. Absolute URLs
// (http/https/data/blob) are passed through untouched.
const ABSOLUTE = /^(?:[a-z]+:)?\/\//i

export function asset(path?: string): string | undefined {
  if (!path) return undefined
  if (ABSOLUTE.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }
  const base = import.meta.env.BASE_URL // e.g. "/pawa-birtday/"
  const clean = path.replace(/^\/+/, '')
  return `${base}${clean}`
}
