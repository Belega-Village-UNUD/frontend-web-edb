/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "ik.imagekit.io",
      "tailwindui.com",
      "flowbite.com",
      "images.unsplash.com",
      "github.com",
    ],
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_PROTOCOL,
        hostname: process.env.NEXT_PUBLIC_HOSTNAME,
      },
    ],
  },
};

module.exports = nextConfig;
