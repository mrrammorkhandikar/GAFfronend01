/** @type {import('next').NextConfig} */
const backendProxy = process.env.BACKEND_PROXY_TARGET?.replace(/\/$/, '')

if (process.env.VERCEL === '1' && !backendProxy && !process.env.NEXT_PUBLIC_API_URL?.trim()) {
  console.warn(
    '[GAF] Vercel: set BACKEND_PROXY_TARGET (e.g. https://your-backend.vercel.app) or NEXT_PUBLIC_API_URL so the site and admin can reach the API.'
  )
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scnbqchktbinrflcalpr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Legacy spam-like URLs indexed by Google should be dropped from results.
        source: '/cate-:path',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
    ]
  },
  async rewrites() {
    if (backendProxy) {
      return [{ source: '/api/:path*', destination: `${backendProxy}/api/:path*` }]
    }
    if (process.env.NODE_ENV === 'development') {
      return [{ source: '/api/:path*', destination: 'http://localhost:3001/api/:path*' }]
    }
    return []
  },
}

export default nextConfig
