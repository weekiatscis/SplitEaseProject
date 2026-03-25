/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/expense/:path*',
        destination: 'https://personal-eamy64us.outsystemscloud.com/ExpenseService/rest/ExpenseAPI/:path*',
      },
    ];
  },
};

export default nextConfig;
