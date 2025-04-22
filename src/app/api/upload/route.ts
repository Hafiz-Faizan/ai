import { NextRequest, NextResponse } from 'next/server';
import { DBService } from '@/services/dbService';
import { Media } from '@/types/website';
import { writeFile } from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

// Upload media file
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const component = formData.get('component') as string;
    const itemId = formData.get('itemId') as string;
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }
    
    // In a real application, you would get the userId from the authenticated user
    // For now, we'll use userId "1" as specified in the requirements
    const userId = "1";
    const websiteId = formData.get('websiteId') as string || "default";
    
    // Create unique filename to prevent collisions
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const filename = `${component}_${timestamp}${fileExtension}`;
    
    // Create the uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save the file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);
    
    // Construct the public URL
    const url = `/uploads/${filename}`;
    
    // Save media record to database
    const media: Media = {
      userId,
      websiteId,
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url,
      component: component as 'navbar' | 'hero' | 'collection' | 'logo',
      itemId: itemId || undefined,
      createdAt: new Date(),
    };
    
    const savedMedia = await DBService.saveMedia(media);
    
    if (!savedMedia) {
      return NextResponse.json({ success: false, message: 'Failed to save media record' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...savedMedia,
        url // Return the URL to be used in the frontend
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}

// Get all media for a website
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get('websiteId') || 'default';
    
    const media = await DBService.getMediaByWebsiteId(websiteId);
    
    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
} 
 