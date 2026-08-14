/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep the live preview cache separate from production builds so the site
  // remains available while an optimized build is being verified.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
