import { WebsiteConfig } from '@/types/website';

export class ApiService {
  /**
   * Fetch website configuration
   */
  static async getWebsiteConfig(): Promise<WebsiteConfig | null> {
    try {
      const response = await fetch('/api/website', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch configuration');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching website config:', error);
      return null;
    }
  }
  
  /**
   * Save website configuration
   */
  static async saveWebsiteConfig(config: Partial<WebsiteConfig>): Promise<WebsiteConfig | null> {
    try {
      const response = await fetch('/api/website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save config: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to save configuration');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error saving website config:', error);
      return null;
    }
  }
  
  /**
   * Upload a file
   */
  static async uploadFile(file: File, component: string, itemId?: string): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('component', component);
      if (itemId) {
        formData.append('itemId', itemId);
      }
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to upload file');
      }
      
      return result.data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }
  
  /**
   * Get all media for a website
   */
  static async getMedia(websiteId = 'default'): Promise<any[] | null> {
    try {
      const response = await fetch(`/api/upload?websiteId=${websiteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch media');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching media:', error);
      return null;
    }
  }
} 
 