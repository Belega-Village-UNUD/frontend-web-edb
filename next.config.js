/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    // domains: [
    //   "firebasestorage.googleapis.com",
    //   "lh3.googleusercontent.com",
    //   "ik.imagekit.io",
    //   "tailwindui.com",
    //   "flowbite.com",
    //   "images.unsplash.com",
    //   "github.com",
    // ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
      {
        protocol: "https",
        hostname: "flowbite.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: process.env.NEXT_PUBLIC_PROTOCOL,
        hostname: process.env.NEXT_PUBLIC_HOSTNAME,
      },
    ],
  },
};

module.exports = nextConfig;
