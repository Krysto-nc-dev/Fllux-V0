/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'uploadthing.com',
      'utfs.io',
      'image.clerk.com',
      'files.stripe.com',
      'krystotest-erp.square.nc',
    ],
  },
  reactStrictMode: false,
}

export default nextConfig
