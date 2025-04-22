'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignIn, useAuth, useUser } from '@clerk/nextjs';
import { SignIn } from '@clerk/nextjs';
import ClerkAuthHandler from '@/components/ClerkAuthHandler';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn, isLoaded: isClerkLoaded } = useSignIn();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { user } = useUser();
  
  const [showCustomForm, setShowCustomForm] = useState(false);

  // If user is already signed in, redirect to dashboard
  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isAuthLoaded, isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isClerkLoaded) return;
    
    setError('');
    setIsLoading(true);

    try {
      // Use Clerk for email/password sign-in
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        // Redirect to dashboard after successful login
        router.push('/dashboard');
      } else {
        console.error('Sign-in result:', result);
        throw new Error('Sign-in failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isClerkLoaded) return;
    
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/sso-callback',
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google login');
    }
  };

  // Include the Clerk Auth Handler in all views
  const clerkAuthHandler = isSignedIn ? <ClerkAuthHandler /> : null;

  // Decide whether to show custom form or Clerk UI
  if (!showCustomForm) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        {clerkAuthHandler}
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8">
              <Link href="/" className="flex items-center text-2xl font-bold text-indigo-600">
                Webify
              </Link>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            </div>
            
            <div className="mt-8">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "mx-auto w-full",
                    card: "shadow-none",
                    formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
                  }
                }}
                path="/sso-callback"
                redirectUrl="/dashboard"
                afterSignInUrl="/dashboard"
              />
              
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setShowCustomForm(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Use custom form instead
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - image/branding */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-800">
            <div className="absolute inset-0 bg-[url('/login-pattern.png')] opacity-10"></div>
            <div className="flex h-full items-center justify-center p-12">
              <div className="max-w-xl text-white">
                <svg className="h-12 w-auto mb-8" viewBox="0 0 100 30" fill="currentColor">
                  <path d="M10 5H5v20h5V5zm15 0h-5v20h5V5zm15 10h-5v10h5V15zm15-10h-5v20h5V5zM40 5h-5v20h5V5zM25 15h-5v10h5V15z" />
                </svg>
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  <span className="block">Welcome back to Webify</span>
                </h2>
                <p className="mt-4 text-lg">
                  Sign in to manage your websites, track analytics, and continue building your online presence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Custom form (legacy view)
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - form */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="flex items-center text-2xl font-bold text-indigo-600">
              Webify
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                create a new account
              </Link>
            </p>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
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

          <div className="mt-8">
            <div>
              <div>
                <p className="text-sm font-medium text-gray-700">Sign in with</p>

                <div className="mt-2">
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    aria-label="Sign in with Google"
                  >
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                    </svg>
                    <span className="ml-2">Sign in with Google</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-4 text-center">
              <button 
                onClick={() => setShowCustomForm(false)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Use Clerk UI instead
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - image/branding */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-800">
          <div className="absolute inset-0 bg-[url('/login-pattern.png')] opacity-10"></div>
          <div className="flex h-full items-center justify-center p-12">
            <div className="max-w-xl text-white">
              <svg className="h-12 w-auto mb-8" viewBox="0 0 100 30" fill="currentColor">
                <path d="M10 5H5v20h5V5zm15 0h-5v20h5V5zm15 10h-5v10h5V15zm15-10h-5v20h5V5zM40 5h-5v20h5V5zM25 15h-5v10h5V15z" />
              </svg>
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                <span className="block">Welcome back to Webify</span>
              </h2>
              <p className="mt-4 text-lg">
                Sign in to manage your websites, track analytics, and continue building your online presence.
              </p>
              <div className="mt-12">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-3xl font-bold">100+</div>
                    <div className="text-sm text-white/80">Templates</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm text-white/80">Support</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-sm text-white/80">Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 