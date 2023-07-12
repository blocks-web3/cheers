/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // FIXME:以下Issueの回避
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
