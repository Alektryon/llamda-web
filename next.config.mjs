/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'gnon.ai',
          },
        ],
        destination: '/gnon',
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'qliphot.systems',
          },
        ],
        destination: '/qliphot/:path',
      },
    ];
  },
};;

export default nextConfig;