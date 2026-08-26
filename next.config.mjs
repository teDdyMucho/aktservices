/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://xzzabzqivilczfvylrip.supabase.co https://*.vercel.app https://*.aktservices.org",
      "media-src 'self' blob: https://xzzabzqivilczfvylrip.supabase.co",
      "connect-src 'self' https://xzzabzqivilczfvylrip.supabase.co https://api.leadconnectorhq.com wss://xzzabzqivilczfvylrip.supabase.co https://primary-production-6722.up.railway.app",
      "frame-src 'self' https://api.leadconnectorhq.com",
      "object-src 'self'",
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
