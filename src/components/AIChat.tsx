import { useState, useRef, useEffect } from 'react';
import { AIService } from '../services/aiService';
import { WebsiteConfig } from '../types/websiteConfig';

interface AIChatProps {
  apiKey: string;
  currentConfig: WebsiteConfig;
  onConfigUpdate: (newConfig: WebsiteConfig) => void;
}

export default function AIChat({ apiKey, currentConfig, onConfigUpdate }: AIChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const aiService = useRef<AIService>(new AIService(apiKey));

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiService.current.getHistory()]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !apiKey || isLoading) return;

    setIsLoading(true);
    try {
      const response = await aiService.current.processUserRequest(inputMessage.trim(), currentConfig);
      
      // Create a new config object with only the updated parts
      const updatedConfig: WebsiteConfig = { ...currentConfig };
      
      if (response.navbarConfig) {
        updatedConfig.navbarConfig = response.navbarConfig;
      }
      
      if (response.heroConfig) {
        updatedConfig.heroConfig = response.heroConfig;
      }
      
      if (response.collectionConfig) {
        updatedConfig.collectionConfig = response.collectionConfig;
      }
      
      // Only call onConfigUpdate if we have changes
      if (response.navbarConfig || response.heroConfig || response.collectionConfig) {
        onConfigUpdate(updatedConfig);
      }
      
      setInputMessage('');
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="mt-4">
      <div 
        ref={chatContainerRef}
        className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto mb-4"
      >
        {aiService.current.getHistory().map((message, index) => (
          <div
            key={index}
            className={`mb-3 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-200'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-400">
            <div className="animate-pulse">Processing...</div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask AI to customize your website..."
          className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className={`px-4 py-2 rounded ${
            isLoading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          title="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 