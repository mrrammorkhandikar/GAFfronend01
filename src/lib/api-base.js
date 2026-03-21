/**
 * Resolves the backend API base (includes `/api` path, no trailing slash).
 * - Prefer NEXT_PUBLIC_API_URL when set (direct to backend).
 * - Otherwise in production browser: same-origin `/api` (Vercel rewrite → backend).
 * - On Vercel server (RSC): `https://${VERCEL_URL}/api` so rewrites still apply.
 */
export function getApiBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')

  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV !== 'production') {
      return 'http://localhost:3001/api'
    }
    return `${window.location.origin}/api`
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`
  }

  return 'http://localhost:3001/api'
}
