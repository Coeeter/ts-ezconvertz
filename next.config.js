/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.FLUENTFFMPEG_COV': false,
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
