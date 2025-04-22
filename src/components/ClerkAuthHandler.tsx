'use client';

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function ClerkAuthHandler() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const syncUserWithDatabase = async () => {
      if (!isLoaded || !isSignedIn || !userId || !user) return;

      try {
        // Get user data from Clerk
        const name = `${user.firstName} ${user.lastName || ''}`.trim();
        const email = user.primaryEmailAddress?.emailAddress;
        
        if (!email) {
          console.error('User email not available from Clerk');
          return;
        }

        // Determine auth source (Google, Github, etc)
        let authSource = 'clerk';
        
        // Check user's OAuth accounts
        if (user.externalAccounts && user.externalAccounts.length > 0) {
          const firstOAuth = user.externalAccounts[0];
          if (firstOAuth.provider) {
            authSource = firstOAuth.provider.toLowerCase();
          }
        }

        // Call our API to sync Clerk user with MySQL database
        const response = await fetch('/api/auth/clerk-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            name,
            authSource,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to sync user with database');
        }

        // Redirect to dashboard after successful auth
        router.push('/dashboard');
      } catch (error) {
        console.error('Error syncing user with database:', error);
      }
    };

    syncUserWithDatabase();
  }, [isLoaded, isSignedIn, user, userId, router]);

  // This component doesn't render anything visible
  return null;
} 