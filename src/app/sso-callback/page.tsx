'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import ClerkAuthHandler from '@/components/ClerkAuthHandler';

export default function SSOCallbackPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    // When fully loaded and not authenticated, redirect to login
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  // This page acts as a middleware to synchronize user data
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ClerkAuthHandler />
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up your account...</p>
        <p className="text-gray-500 text-sm mt-2">You'll be redirected to your dashboard shortly.</p>
      </div>
    </div>
  );
} 