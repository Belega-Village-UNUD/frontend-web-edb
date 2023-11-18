/** @type {import('next').NextConfig} */

const {parse: parseEnv} = require('dotenv').config();

const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
  },
  // env: {
  //   NEXT_PUBLIC_API_URL: parseEnv.NEXT_PUBLIC_API_URL,
  // }
}

module.exports = nextConfig
