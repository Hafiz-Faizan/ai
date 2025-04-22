'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
import { SignUp } from '@clerk/nextjs';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signUp, isLoaded: isClerkLoaded } = useSignUp();
  
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isClerkLoaded) return;
    
    setError('');
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Use Clerk for email/password sign-up
      const result = await signUp.create({
        firstName: name.split(' ')[0],
        lastName: name.includes(' ') ? name.split(' ').slice(1).join(' ') : '',
        emailAddress: email,
        password,
      });
      
      if (result.status === 'complete') {
        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
        
        // Redirect to verification page (you'd need to create this)
        router.push('/verify-email');
      } else if (result.status === 'needs_email_verification') {
        // Handle email verification
        router.push('/verify-email');
      } else {
        console.error('Sign-up result:', result);
        throw new Error('Sign-up failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!isClerkLoaded) return;
    
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google signup');
    }
  };

  // Decide whether to show custom form or Clerk UI
  if (!showCustomForm) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8">
              <Link href="/" className="flex items-center text-2xl font-bold text-indigo-600">
                Webify
              </Link>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create a new account</h2>
            </div>
            
            <div className="mt-8">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "mx-auto w-full",
                    card: "shadow-none",
                    formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
                  }
                }}
                redirectUrl="/dashboard"
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
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
            <div className="absolute inset-0 bg-[url('/signup-pattern.png')] opacity-10"></div>
            <div className="flex h-full items-center justify-center p-12">
              <div className="max-w-xl text-white">
                <svg className="h-12 w-auto mb-8" viewBox="0 0 100 30" fill="currentColor">
                  <path d="M10 5H5v20h5V5zm15 0h-5v20h5V5zm15 10h-5v10h5V15zm15-10h-5v20h5V5zM40 5h-5v20h5V5zM25 15h-5v10h5V15z" />
                </svg>
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  <span className="block">Join Webify today</span>
                </h2>
                <p className="mt-4 text-lg">
                  Create an account to start building beautiful websites with AI assistance. No coding skills required.
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
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create a new account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
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
                <p className="text-sm font-medium text-gray-700">Sign up with</p>

                <div className="mt-2">
                  <button
                    onClick={handleGoogleSignup}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    aria-label="Sign up with Google"
                  >
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                    </svg>
                    <span className="ml-2">Sign up with Google</span>
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

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

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Privacy Policy
                    </a>
                  </label>
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
                        Creating account...
                      </>
                    ) : (
                      'Create account'
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
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
          <div className="absolute inset-0 bg-[url('/signup-pattern.png')] opacity-10"></div>
          <div className="flex h-full items-center justify-center p-12">
            <div className="max-w-xl text-white">
              <svg className="h-12 w-auto mb-8" viewBox="0 0 100 30" fill="currentColor">
                <path d="M10 5H5v20h5V5zm15 0h-5v20h5V5zm15 10h-5v10h5V15zm15-10h-5v20h5V5zM40 5h-5v20h5V5zM25 15h-5v10h5V15z" />
              </svg>
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                <span className="block">Join Webify today</span>
              </h2>
              <p className="mt-4 text-lg">
                Create an account to start building beautiful websites with AI assistance. No coding skills required.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white/20 p-1 rounded-full">
                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-white text-lg">Build your site with simple conversation</p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white/20 p-1 rounded-full">
                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-white text-lg">Launch your site in minutes, not days</p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white/20 p-1 rounded-full">
                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-white text-lg">Free during beta, sign up now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 