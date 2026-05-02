'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { initSocket, disconnectSocket } from '@/lib/socket';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartPanel from '@/components/layout/CartPanel';
import MobileCartBar from '@/components/layout/MobileCartBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Initialize socket connection
    initSocket();
    
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <CartPanel />
      <MobileCartBar />
    </div>
  );
}
