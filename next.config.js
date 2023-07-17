/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false, encoding: false, memcpy: false,  };
    return config;
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  }
}

module.exports = nextConfig
