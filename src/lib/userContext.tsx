'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  clerkId?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  syncUserWithDatabase: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  error: null,
  syncUserWithDatabase: async () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded: isClerkLoaded, userId } = useAuth();
  const { user: clerkUser } = useUser();

  // Fetch user data from your database based on Clerk auth
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // If the user is not authenticated in Clerk, clear local user state
      if (!userId || !clerkUser) {
        setUser(null);
        return;
      }

      // Try to get user from your database by clerk ID
      const response = await fetch('/api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'An error occurred while fetching user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Sync Clerk user with your database
  const syncUserWithDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!userId || !clerkUser) return;

      const response = await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: userId,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          name: `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync user data');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err: any) {
      console.error('Error syncing user data:', err);
      setError(err.message || 'An error occurred while syncing user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data when Clerk authentication state changes
  useEffect(() => {
    if (isClerkLoaded) {
      if (userId) {
        fetchUserData();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [isClerkLoaded, userId]);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        syncUserWithDatabase,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 