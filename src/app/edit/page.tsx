'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar';
import Hero from '../../components/hero';
import Collection from '@/components/Collection';

type EditableComponent = 'navbar' | 'hero' | 'header' | 'footer' | 'content' | 'collection' | null;

// API key for AI services
const OPENAI_API_KEY = 'AIzaSyCiYjw2tHMyFGVysLOTBztOl2Z9H4l8L3E';

export default function Editor() {
  const [editingComponent, setEditingComponent] = useState<EditableComponent>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // Add state for saved items and styles
  const [navItems, setNavItems] = useState(null);
  const [navStyles, setNavStyles] = useState(null);
  const [heroItems, setHeroItems] = useState(null);
  const [heroStyles, setHeroStyles] = useState(null);
  const [collectionItems, setCollectionItems] = useState(null);
  const [collectionStyles, setCollectionStyles] = useState(null);

  // Check if this is the first visit and load saved data
  useEffect(() => {
    if (!initialized) {
      // Check if this is the first visit
      const hasVisitedBefore = localStorage.getItem('hasVisitedBuilder');
      if (hasVisitedBefore === 'true') {
        setShowWelcome(false);
      } else {
        setShowWelcome(true);
      }
      
      // Load saved settings
      const savedNavItems = localStorage.getItem('navItems');
      const savedNavStyles = localStorage.getItem('navStyles');
      const savedHeroItems = localStorage.getItem('heroItems');
      const savedHeroStyles = localStorage.getItem('heroStyles');
      const savedCollectionItems = localStorage.getItem('collectionItems');
      const savedCollectionStyles = localStorage.getItem('collectionStyles');
      
      if (savedNavItems) setNavItems(JSON.parse(savedNavItems));
      if (savedNavStyles) setNavStyles(JSON.parse(savedNavStyles));
      if (savedHeroItems) setHeroItems(JSON.parse(savedHeroItems));
      if (savedHeroStyles) setHeroStyles(JSON.parse(savedHeroStyles));
      if (savedCollectionItems) setCollectionItems(JSON.parse(savedCollectionItems));
      if (savedCollectionStyles) setCollectionStyles(JSON.parse(savedCollectionStyles));
      
      setInitialized(true);
    }
  }, [initialized]);

  const handleSave = () => {
    setEditingComponent(null);
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasVisitedBuilder', 'true');
  };

  return (
    <main className="min-h-screen relative">
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <h2 className="text-2xl font-bold text-white">Welcome to Website Builder</h2>
              <p className="text-blue-100 mt-2">Your powerful tool for creating beautiful websites without coding</p>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Select a Component</h4>
                    <p className="text-gray-600">Click on any component from the left sidebar to start editing.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Customize</h4>
                    <p className="text-gray-600">Use the editing panel to change colors, fonts, content, and layout.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Save & Preview</h4>
                    <p className="text-gray-600">Click Save when you're done, and use the Preview button to see your changes.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">AI Assistant</h4>
                    <p className="text-gray-600">When editing a component, you'll find an AI assistant at the bottom of the editing panel.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={dismissWelcome}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Got it, let's build!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Popup */}
      {showTips && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowTips(false)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">AI Assistant Tips</h2>
                <button 
                  onClick={() => setShowTips(false)}
                  className="text-white hover:text-indigo-200"
                  title="Close tips"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <p className="text-gray-700">
                  When you select a component from the sidebar, you'll find an AI assistant at the bottom of the editing panel that can help you with:
                </p>
              </div>
              
              <ul className="space-y-3 mb-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Changing colors, fonts, and styles</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Suggesting design improvements</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Creating content and copywriting</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Answering questions about website building</span>
                </li>
              </ul>
              
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <p className="text-gray-700 text-sm">
                  <strong>Pro tip:</strong> Try asking the AI assistant to "change the navbar color to blue" or "suggest a professional color scheme" when editing a component.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Button */}
      <a
        href="/home"
        target="_blank"
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center hover:scale-110"
        title="View Live Site"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </a>
      
      {/* Tips Button */}
      <button
        onClick={() => setShowTips(true)}
        className="fixed bottom-8 right-28 z-40 w-14 h-14 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition-all duration-200 flex items-center justify-center hover:scale-110 animate-pulse-custom"
        title="Show AI Assistant Tips"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      {/* Component Selection Menu */}
      {!editingComponent && (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-40">
          <h3 className="text-lg font-semibold mb-4">Edit Components</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setEditingComponent('navbar')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-left flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Navigation Bar
            </button>
            <button
              onClick={() => setEditingComponent('hero')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-left flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Hero Section
            </button>
            <button
              onClick={() => setEditingComponent('collection')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-left flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Collection Section
            </button>
          </div>
        </div>
      )}

      {/* Components */}
      <Navbar 
        isAdmin={true} 
        isEditing={editingComponent === 'navbar'}
        onStartEdit={() => setEditingComponent('navbar')}
        onSave={handleSave}
        apiKey={OPENAI_API_KEY}
        savedItems={navItems}
        savedStyles={navStyles}
      />
      
      <Hero
        isAdmin={true}
        isEditing={editingComponent === 'hero'}
        onStartEdit={() => setEditingComponent('hero')}
        onSave={handleSave}
        apiKey={OPENAI_API_KEY}
        savedItems={heroItems}
        savedStyles={heroStyles}
      />

      <Collection 
        isAdmin={true}
        isEditing={editingComponent === 'collection'}
        onStartEdit={() => setEditingComponent('collection')}
        onSave={handleSave}
        apiKey={OPENAI_API_KEY}
        savedItems={collectionItems}
        savedStyles={collectionStyles}
      />
      
      {/* Empty state when no component is selected */}
      {!editingComponent && !showWelcome && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md p-8">
            <div className="mb-6 text-indigo-500 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Component</h2>
            <p className="text-gray-600 mb-6">
              Choose a component from the left sidebar to start editing your website.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowTips(true)}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View AI Assistant Tips
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 