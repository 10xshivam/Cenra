/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [new URL('https://avatar.vercel.sh/**')],
  },
}

export default nextConfig
