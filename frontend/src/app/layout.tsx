
import { AuthProvider, useAuth } from '@/context/AuthContext';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Email Marketing Platform',
  description: 'Create and manage email marketing sequences',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-right" richColors />
          <ClientLayoutWrapper>
          {children}
          </ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}