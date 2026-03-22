import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { GroupProvider } from '@/context/GroupContext';

export const metadata = {
  title: 'SplitEase — Split Bills with Friends',
  description: 'A split-bill payment dashboard for friends and roommates',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <GroupProvider>
              {children}
            </GroupProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
