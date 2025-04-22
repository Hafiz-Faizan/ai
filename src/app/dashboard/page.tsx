'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useUser } from '@clerk/nextjs';
import { useUserContext } from '@/lib/userContext';
import ClerkAuthHandler from '@/components/ClerkAuthHandler';

interface Store {
  id: string;
  store_name: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isLoaded, userId, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const { user, isLoading: isUserLoading, syncUserWithDatabase } = useUserContext();
  
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Sync user with database when Clerk user is loaded
  useEffect(() => {
    if (isLoaded && userId && isSignedIn && clerkUser) {
      syncUserWithDatabase();
    }
  }, [isLoaded, userId, isSignedIn, clerkUser, syncUserWithDatabase]);

  // Fetch user's stores when the user is loaded
  useEffect(() => {
    const fetchUserStores = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/stores', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }

        const data = await response.json();
        setStores(data.stores || []);
      } catch (err: any) {
        console.error('Error fetching stores:', err);
        setError(err.message || 'Failed to load your projects');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserStores();
    }
  }, [user]);

  // Handle creating a new store
  const handleCreateNewStore = () => {
    router.push('/create-web');
  };

  // Handle loading a store
  const handleLoadStore = (storeId: string, storeName: string) => {
    // Save the current store in localStorage for reference
    localStorage.setItem('currentStoreId', storeId);
    localStorage.setItem('currentStoreName', storeName);
    
    // Navigate to the home page for this store
    router.push('/home');
  };

  if (!isLoaded || isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If the user is signed in with Clerk but not synced with database yet
  if (isSignedIn && !user && !isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ClerkAuthHandler />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn && !user && !isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
          <Link 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-semibold">{user?.name || clerkUser?.firstName}</span>
            </div>
            <Link
              href="/profile"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              My Profile
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Projects</h2>
            <button
              onClick={handleCreateNewStore}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create New Project
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 h-48">
                  <div className="h-6 bg-gray-200 rounded-md mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-md mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-md mb-2 w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded-md mb-6 w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded-md w-full mt-auto"></div>
                </div>
              ))}
            </div>
          ) : stores.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first project
              </p>
              <button
                onClick={handleCreateNewStore}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create New Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div key={store.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{store.store_name}</h3>
                  <p className="text-gray-600 text-sm mb-1">
                    Created: {new Date(store.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => handleLoadStore(store.id, store.store_name)}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Open Project
                    </button>
                  </div>
                </div>
              ))}
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer" onClick={handleCreateNewStore}>
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span className="text-gray-600 font-medium">Create New Project</span>
              </div>
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-gray-600 mb-4">Learn how to get the most out of Webify with our comprehensive guide.</p>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Read Documentation →</a>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tutorials</h3>
              <p className="text-gray-600 mb-4">Follow step-by-step tutorials to build amazing websites.</p>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Watch Tutorials →</a>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600 mb-4">Need help? Our support team is always ready to assist you.</p>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Contact Support →</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
