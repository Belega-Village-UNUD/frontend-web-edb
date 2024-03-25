/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "ik.imagekit.io",
      "tailwindui.com",
      "flowbite.com",
    ],
  },
};

module.exports = nextConfig;
