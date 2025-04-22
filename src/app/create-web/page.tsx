'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AIService } from '../../services/aiService';
import { ApiService } from '@/services/apiService';
import { useAuth } from '@clerk/nextjs';
import { useUserContext } from '@/lib/userContext';

// Define proper interfaces for navigation items
interface NavItemStyles {
  color?: string;
  fontSize?: string;
  padding?: string;
  fontWeight?: string;
  textTransform?: string;
  letterSpacing?: string;
  transition?: string;
  backgroundColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  width?: string;
  height?: string;
  objectFit?: string;
  hover?: {
    color?: string;
    backgroundColor?: string;
    transform?: string;
    boxShadow?: string;
  };
  after?: {
    content?: string;
    marginLeft?: string;
    transition?: string;
  };
  'hover:after'?: {
    transform?: string;
  };
}

interface NavItem {
  id: string;
  type: 'link' | 'image' | 'button';
  label: string;
  link: string;
  position: 'left' | 'right' | 'nav';
  imageUrl?: string;
  styles: NavItemStyles;
}

interface HeroItem {
  id: string;
  type: string;
  content: string;
  position: string;
  link?: string;
  imageUrl?: string;
  styles: Record<string, any>;
}

export default function SetupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoaded, userId } = useAuth();
  const { user, syncUserWithDatabase } = useUserContext();
  
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    logo: '',
    heroImage: '/hero.jpg',
    backgroundImage: '/slideshow-1.jpg'
  });

  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [authError, setAuthError] = useState('');

  // Check authentication on load
  useEffect(() => {
    if (isLoaded && !userId) {
      setAuthError('You must be logged in to create a store.');
    } else if (isLoaded && userId && !user) {
      syncUserWithDatabase();
    }
  }, [isLoaded, userId, user, syncUserWithDatabase]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Upload the file to the server and save in MongoDB
      const logoUrl = await ApiService.uploadFile(file, 'logo');
      
      if (logoUrl) {
        setFormData(prev => ({ ...prev, logo: logoUrl }));
      } else {
        throw new Error('Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setAuthError('You must be logged in to create a store.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Generate hero content using AI
      const aiService = new AIService('AIzaSyCiYjw2tHMyFGVysLOTBztOl2Z9H4l8L3E');
      const heroContent = await aiService.generateHeroContent(formData.storeName, formData.storeDescription);

      // Save navbar settings
      const navItems: NavItem[] = [
        {
          id: 'logo',
          type: 'image',
          label: formData.storeName,
          link: '/',
          position: 'left',
          imageUrl: formData.logo,
          styles: {
            width: '40px',
            height: '40px',
            objectFit: 'contain',
          }
        },
        {
          id: '1',
          type: 'link',
          label: 'Home',
          link: '/',
          position: 'nav',
          styles: {
            color: formData.secondaryColor,
            fontSize: '16px',
            padding: '0.5rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease',
            hover: {
              color: formData.primaryColor
            }
          }
        },
        {
          id: '2',
          type: 'link',
          label: 'Products',
          link: '/products',
          position: 'nav',
          styles: {
            color: formData.secondaryColor,
            fontSize: '16px',
            padding: '0.5rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease',
            hover: {
              color: formData.primaryColor
            }
          }
        },
        {
          id: '3',
          type: 'link',
          label: 'Case Studies',
          link: '/case-studies',
          position: 'nav',
          styles: {
            color: formData.secondaryColor,
            fontSize: '16px',
            padding: '0.5rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease',
            hover: {
              color: formData.primaryColor
            }
          }
        },
        {
          id: '4',
          type: 'link',
          label: 'About',
          link: '/about',
          position: 'nav',
          styles: {
            color: formData.secondaryColor,
            fontSize: '16px',
            padding: '0.5rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease',
            hover: {
              color: formData.primaryColor
            }
          }
        },
        {
          id: '5',
          type: 'link',
          label: 'Contact',
          link: '/contact',
          position: 'right',
          styles: {
            color: '#ffffff',
            fontSize: '16px',
            padding: '0.75rem 1.5rem',
            fontWeight: '600',
            backgroundColor: formData.primaryColor,
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            hover: {
              backgroundColor: formData.secondaryColor,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
            }
          }
        }
      ];

      const navStyles = {
        backgroundColor: '#ffffff',
        padding: '1rem',
        fontFamily: 'Inter',
        color: formData.secondaryColor,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      };

      // Save hero settings with AI-generated content
      const heroItems: HeroItem[] = [
        {
          id: 'badge1',
          type: 'badge',
          content: `Welcome to ${formData.storeName}`,
          position: 'left',
          styles: {
            color: '#ffffff',
            backgroundColor: 'rgba(255,255,255,0.2)',
            fontSize: '14px',
            fontWeight: '600',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            marginBottom: '1rem',
            backdropFilter: 'blur(4px)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'inline-block'
          }
        },
        {
          id: 'heading1',
          type: 'heading',
          content: heroContent.heroTitle,
          position: 'left',
          styles: {
            color: '#ffffff',
            fontSize: '56px',
            fontWeight: '700',
            marginBottom: '1rem',
            lineHeight: '1.2',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }
        },
        {
          id: 'subheading1',
          type: 'subheading',
          content: heroContent.heroSubtitle,
          position: 'left',
          styles: {
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: '400',
            marginBottom: '2rem',
            maxWidth: '600px',
            lineHeight: '1.6',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }
        },
        {
          id: 'button1',
          type: 'button',
          content: heroContent.ctaText,
          link: heroContent.ctaLink,
          position: 'left',
          styles: {
            color: '#ffffff',
            backgroundColor: '#333333',
            fontSize: '16px',
            fontWeight: '600',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: 'auto',
            border: '1px solid rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            hover: {
              backgroundColor: '#4a4a4a',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
            },
            after: {
              content: '→',
              marginLeft: '0.5rem',
              transition: 'transform 0.3s ease',
            },
            'hover:after': {
              transform: 'translateX(4px)'
            }
          }
        },
        {
          id: 'image1',
          type: 'image',
          content: 'Hero Image',
          position: 'right',
          imageUrl: formData.heroImage,
          styles: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '12px',
            boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: '2'
          }
        }
      ];

      const heroStyles = {
        backgroundColor: 'transparent',
        backgroundImage: formData.backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '600px',
        padding: '4rem',
        fontFamily: 'Inter',
        color: '#ffffff',
        layout: 'left-content',
        backgroundOverlay: 'rgba(0,0,0,0.4)',
        overlayOpacity: '1'
      };

      // Generate a unique ID for the store
      const storeId = 'store_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);

      // Save to MongoDB using our API service
      const websiteConfig = {
        storeId,
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        logo: formData.logo,
        heroImage: formData.heroImage,
        backgroundImage: formData.backgroundImage,
        navItems,
        navStyles,
        heroItems,
        heroStyles,
        setupComplete: true
      };

      const savedConfig = await ApiService.saveWebsiteConfig(websiteConfig);
      
      if (!savedConfig) {
        throw new Error('Failed to save website configuration');
      }

      // For backward compatibility, still save to localStorage as well
      localStorage.setItem('currentStoreId', storeId);
      localStorage.setItem('currentStoreName', formData.storeName);
      localStorage.setItem('navItems', JSON.stringify(navItems));
      localStorage.setItem('navStyles', JSON.stringify(navStyles));
      localStorage.setItem('heroItems', JSON.stringify(heroItems));
      localStorage.setItem('heroStyles', JSON.stringify(heroStyles));
      localStorage.setItem('setupComplete', 'true');

      // Save this store to the user's list of stores
      await saveStoreToUserDatabase(user.id, formData.storeName, storeId);

      // Redirect to home page
      router.push('/home');
    } catch (error) {
      console.error('Error during setup:', error);
      alert('Failed to complete setup. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to save the store to the user_stores table
  const saveStoreToUserDatabase = async (userId: number, storeName: string, storeId: string) => {
    try {
      const response = await fetch('/api/user/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          storeName,
          storeId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save store to user database');
      }

      return true;
    } catch (error) {
      console.error('Error saving store to user database:', error);
      return false;
    }
  };

  // If user is not authenticated, show an error
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-xl border border-gray-700 max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-300 mb-6">{authError}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Setup Your Website</h1>
          <p className="mt-2 text-gray-300">Let's create something amazing together</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step >= item ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {item}
                </div>
                <span className="text-sm text-gray-400">
                  {item === 1 ? 'Basic Info' : item === 2 ? 'Branding' : 'Content'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1 bg-gray-700 rounded">
            <div
              className="h-full bg-blue-500 rounded transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400"
                  placeholder="Enter your store name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Store Description
                </label>
                <textarea
                  value={formData.storeDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeDescription: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400"
                  rows={3}
                  placeholder="Brief description of your store"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Store Logo
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  title="Choose logo file"
                  aria-label="Store logo upload"
                />
      <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 border border-gray-600"
                >
                  {isUploading ? 'Uploading...' : 'Choose Logo'}
                </button>
                {formData.logo && (
                  <div className="mt-2 p-2 bg-gray-800 rounded-md">
                    <img src={formData.logo} alt="Logo preview" className="h-20 object-contain mx-auto" />
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Colors and Branding */}
        {step === 2 && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Colors & Branding</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-full h-12 rounded-md cursor-pointer"
                  title="Select primary color"
                  aria-label="Primary color"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Secondary Color
                </label>
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-full h-12 rounded-md cursor-pointer"
                  title="Select secondary color"
                  aria-label="Secondary color"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
          </div>
        </div>
      )}

        {/* Step 3: Hero Section - Remove the manual input fields */}
        {step === 3 && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Final Step</h2>
            <p className="text-gray-300 mb-6">
              Our AI will generate engaging hero content based on your store information. Click "Finish Setup" to continue.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isGenerating || !formData.storeName}
                className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Content...
                  </>
                ) : (
                  'Finish Setup'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
