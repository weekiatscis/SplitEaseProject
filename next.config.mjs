/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const rules = [];

    // Users / Auth API (Login, GetAllUsers, users/create)
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      rules.push({
        source: '/api/users/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      });
    }

    // Pay-expense (single POST endpoint) — only added when env var is present
    if (process.env.NEXT_PUBLIC_PAY_EXPENSE_API_URL) {
      rules.push({
        source: '/api/pay-expense',
        destination: process.env.NEXT_PUBLIC_PAY_EXPENSE_API_URL,
      });
    }

    return rules;
  },
};

export default nextConfig;
