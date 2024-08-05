/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'uploadthing.com',
      'utfs.io',
      'img.clerk.com', // Correction du domaine ici
      'files.stripe.com',
      'krystotest-erp.square.nc',
    ],
  },
  reactStrictMode: false,
}

export default nextConfig
