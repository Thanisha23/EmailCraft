"use client";

import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayoutWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {isAuthenticated && <Navbar />}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
      {isAuthenticated && <Footer />}
    </div>
  );
}