import { WebsiteConfig, Media } from '../types/website';
import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

export class DBService {
  /**
   * Get website configuration by user ID
   */
  static async getWebsiteConfigByUserId(userId: string): Promise<WebsiteConfig | null> {
    try {
      const client = await clientPromise;
      const db = client.db('websiteBuilder');
      const websiteConfig = await db.collection('websites').findOne({ userId }) as WebsiteConfig;
      return websiteConfig;
    } catch (error) {
      console.error('Error fetching website config:', error);
      return null;
    }
  }

  /**
   * Create or update website configuration
   */
  static async saveWebsiteConfig(websiteConfig: WebsiteConfig): Promise<WebsiteConfig | null> {
    try {
      const client = await clientPromise;
      const db = client.db('websiteBuilder');
      
      // Add timestamps
      const now = new Date();
      websiteConfig.updatedAt = now;
      
      if (websiteConfig._id) {
        // Update existing config
        const result = await db.collection('websites').updateOne(
          { _id: websiteConfig._id },
          { $set: websiteConfig }
        );
        return result.modifiedCount > 0 ? websiteConfig : null;
      } else {
        // Create new config
        websiteConfig.createdAt = now;
        const result = await db.collection('websites').insertOne(websiteConfig);
        return { ...websiteConfig, _id: result.insertedId };
      }
    } catch (error) {
      console.error('Error saving website config:', error);
      return null;
    }
  }

  /**
   * Save a media file
   */
  static async saveMedia(mediaData: Media): Promise<Media | null> {
    try {
      const client = await clientPromise;
      const db = client.db('websiteBuilder');
      
      // Add creation timestamp
      mediaData.createdAt = new Date();
      
      const result = await db.collection('media').insertOne(mediaData);
      return { ...mediaData, _id: result.insertedId };
    } catch (error) {
      console.error('Error saving media:', error);
      return null;
    }
  }

  /**
   * Get media by ID
   */
  static async getMediaById(mediaId: string): Promise<Media | null> {
    try {
      const client = await clientPromise;
      const db = client.db('websiteBuilder');
      const media = await db.collection('media').findOne({ _id: new ObjectId(mediaId) }) as Media;
      return media;
    } catch (error) {
      console.error('Error fetching media:', error);
      return null;
    }
  }

  /**
   * Get all media for a website
   */
  static async getMediaByWebsiteId(websiteId: string): Promise<Media[]> {
    try {
      const client = await clientPromise;
      const db = client.db('websiteBuilder');
      const media = await db.collection('media')
        .find({ websiteId })
        .sort({ createdAt: -1 })
        .toArray() as Media[];
      return media;
    } catch (error) {
      console.error('Error fetching media:', error);
      return [];
    }
  }

  /**
   * Delete media by ID
   */
  static async deleteMedia(mediaId: string): Promise<boolean> {
    try {
      const client = await clientPromise;
      const db = client.db('websiteBuilder');
      const result = await db.collection('media').deleteOne({ _id: new ObjectId(mediaId) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting media:', error);
      return false;
    }
  }
} 
 