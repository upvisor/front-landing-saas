/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iframe.mediadelivery.net',
        port: '',
        pathname: '/embed/**'
      }, {
        protocol: 'https',
        hostname: 'imagenes-sitio-web-upvisor.b-cdn.net',
        port: '',
        pathname: '/**'
      },  {
        protocol: 'https',
        hostname: 'imagenes-upvisor-web.b-cdn.net',
        port: '',
        pathname: '/**'
      },  {
        protocol: 'https',
        hostname: 'cdn-web-upvisor.b-cdn.net',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
