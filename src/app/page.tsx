'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      title: "AI-Powered Design",
      description: "Create stunning websites with the help of our AI assistant. Just describe what you want, and watch your vision come to life.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      ),
      image: "/features/ai-design.png"
    },
    {
      title: "E-Commerce Ready",
      description: "Launch your online store with built-in product catalogs, payments integration, and inventory management.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      ),
      image: "/features/ecommerce.png"
    },
    {
      title: "Responsive Design",
      description: "Your website will look perfect on any device, from desktops to tablets and mobile phones.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      ),
      image: "/features/responsive.png"
    },
    {
      title: "Customizable Templates",
      description: "Start with beautiful, professionally designed templates and customize them to match your brand.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      image: "/features/templates.png"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">Webify</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
                Build Your E-Commerce Website by Just Chatting
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-indigo-100">
                Webify uses AI to help you build beautiful, functional websites with natural language. 
                No coding required — just chat with our AI assistant and watch your ideas come to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
                <Link
                  href="#demo"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 bg-opacity-30 hover:bg-opacity-40 md:py-4 md:text-lg md:px-10"
                >
                  Watch Demo
                </Link>
              </div>
            </div>
            <div className="relative h-96 rounded-xl shadow-2xl overflow-hidden hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-80 rounded-xl"></div>
              <div className="absolute inset-2 bg-black rounded-lg overflow-hidden">
                <div className="bg-gray-900 h-8 flex items-center px-4 space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 text-xs text-gray-400">Building your website with AI...</div>
                </div>
                <div className="p-4 flex flex-col h-full">
                  <div className="flex gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">AI</div>
                    <div className="bg-indigo-800 bg-opacity-50 rounded-lg p-3 text-white text-sm max-w-xs">
                      <p>How would you like your e-commerce store to look?</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mb-4 justify-end">
                    <div className="bg-indigo-600 rounded-lg p-3 text-white text-sm max-w-xs">
                      <p>I want a modern design with a focus on sustainability products.</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">U</div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">AI</div>
                    <div className="bg-indigo-800 bg-opacity-50 rounded-lg p-3 text-white text-sm max-w-xs">
                      <p>Great! I'll create an eco-friendly theme with earth tones and a clean layout. What kind of products will you be selling?</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-auto bg-gray-800 rounded-lg p-2">
                    <input type="text" placeholder="Type your message..." className="bg-transparent border-none w-full text-white focus:outline-none text-sm" />
                    <button className="ml-2 text-indigo-400 hover:text-indigo-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold tracking-wide uppercase text-indigo-600">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to build your online presence
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Webify combines ease of use with powerful features to help you create a website that stands out.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-10">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`flex gap-4 p-4 rounded-lg cursor-pointer transition ${activeFeature === index ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-gray-50'}`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden shadow-md">
              {/* Placeholder for feature images */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 text-center px-4">
                  Feature image placeholder<br/>
                  (Would display {features[activeFeature].title})
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold tracking-wide uppercase text-indigo-600">Process</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How Webify Works
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Creating your website is simple, fast, and fun with our AI-powered platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-8 bg-white rounded-lg shadow">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">1</div>
              <h3 className="text-xl font-medium text-gray-900 mt-4">Chat with the AI</h3>
              <p className="mt-2 text-gray-500">Tell our AI assistant what kind of website you want. Describe your business, style preferences, and needs.</p>
            </div>
            <div className="relative p-8 bg-white rounded-lg shadow">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">2</div>
              <h3 className="text-xl font-medium text-gray-900 mt-4">Review and Customize</h3>
              <p className="mt-2 text-gray-500">Preview your AI-generated website and make adjustments through our intuitive editor or by chatting more with the AI.</p>
            </div>
            <div className="relative p-8 bg-white rounded-lg shadow">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">3</div>
              <h3 className="text-xl font-medium text-gray-900 mt-4">Launch Your Site</h3>
              <p className="mt-2 text-gray-500">Publish your website with one click. Add your domain name, and start growing your online business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold tracking-wide uppercase text-indigo-600">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What Our Customers Say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold">JD</div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Jane Doe</h4>
                  <p className="text-gray-500">Boutique Owner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I had no design experience, but with Webify, I built a beautiful online store in a day. The AI understood exactly what I wanted!"
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold">JS</div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">John Smith</h4>
                  <p className="text-gray-500">Fitness Coach</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Webify helped me launch my coaching business online. The conversational interface made it so easy to explain what I needed."
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold">AJ</div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Alex Johnson</h4>
                  <p className="text-gray-500">Startup Founder</p>
                </div>
              </div>
              <p className="text-gray-600">
                "We needed to launch quickly with limited resources. Webify's AI builder saved us thousands in development costs."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-16 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
            Ready to build your dream website?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join thousands of business owners who have transformed their online presence with Webify.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
          >
            Get Started for Free
          </Link>
          <p className="mt-4 text-sm text-indigo-200">No credit card required. Free plan available.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Webify</h3>
              <p className="text-gray-400">Building the future of website creation with AI-powered tools.</p>
            </div>
            <div>
              <h4 className="text-md font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
                <li><a href="#" className="hover:text-white">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2023 Webify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
