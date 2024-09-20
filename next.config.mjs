/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,   // Ignores TypeScript errors during production builds
    },
    eslint: {
      ignoreDuringBuilds: true,  // Ignores ESLint errors during production builds
    },
    images: {
        domains: [
          'uploadthing.com',
          'utfs.io',
          'img.clerk.com',
          'subdomain',
          'files.stripe.com',
        ],
    },
    reactStrictMode: false,
};

export default nextConfig;
