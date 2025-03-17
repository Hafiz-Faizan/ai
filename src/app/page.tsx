'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AIService } from '../services/aiService';

export default function SetupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const imageUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, logo: imageUrl }));
    setIsUploading(false);
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    
    try {
      // Generate hero content using AI
      const aiService = new AIService('AIzaSyCiYjw2tHMyFGVysLOTBztOl2Z9H4l8L3E');
      const heroContent = await aiService.generateHeroContent(formData.storeName, formData.storeDescription);

      // Save navbar settings
      const navItems = [
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
      const heroItems = [
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

      // Save to localStorage
      localStorage.setItem('navItems', JSON.stringify(navItems));
      localStorage.setItem('navStyles', JSON.stringify(navStyles));
      localStorage.setItem('heroItems', JSON.stringify(heroItems));
      localStorage.setItem('heroStyles', JSON.stringify(heroStyles));
      localStorage.setItem('setupComplete', 'true');

      // Redirect to home page
      router.push('/home');
    } catch (error) {
      console.error('Error during setup:', error);
      // Handle error appropriately
    } finally {
      setIsGenerating(false);
    }
  };

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
                disabled={isGenerating}
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
