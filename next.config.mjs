/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Auth / Users — Flask auth_service (port 5001)
      { source: '/api/users/:path*', destination: 'http://localhost:5001/:path*' },

      // Groups — Flask group_service (port 5002)
      { source: '/api/groups/:path*', destination: 'http://localhost:5002/:path*' },

      // Expense summary — Flask expense_service (port 5003)
      // Must come before /api/expense/:path* to avoid prefix collision
      { source: '/api/expense-summary/:path*', destination: 'http://localhost:5003/:path*' },

      // Even split — Flask expense_service (port 5003)
      { source: '/api/even-split/:path*', destination: 'http://localhost:5003/:path*' },

      // Expense — Flask expense_service (port 5003)
      { source: '/api/expense/:path*', destination: 'http://localhost:5003/:path*' },

      // Balance + payment — Flask payment_service (port 5004)
      { source: '/api/balance/:path*', destination: 'http://localhost:5004/:path*' },
      { source: '/api/payment/:path*', destination: 'http://localhost:5004/:path*' },
    ];
  },
};

export default nextConfig;
