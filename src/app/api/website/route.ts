import { NextRequest, NextResponse } from 'next/server';
import { DBService } from '@/services/dbService';
import { WebsiteConfig } from '@/types/website';

// Get website configuration
export async function GET(req: NextRequest) {
  try {
    // In a real application, you would get the userId from the authenticated user
    // For now, we'll use userId "1" as specified in the requirements
    const userId = "1";
    
    const websiteConfig = await DBService.getWebsiteConfigByUserId(userId);
    
    if (!websiteConfig) {
      return NextResponse.json({ success: false, message: 'Website configuration not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: websiteConfig });
  } catch (error) {
    console.error('Error fetching website config:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}

// Save website configuration
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // In a real application, you would get the userId from the authenticated user
    // For now, we'll use userId "1" as specified in the requirements
    const userId = "1";
    
    // Create or update website config
    const websiteConfig: WebsiteConfig = {
      userId,
      ...body,
    };
    
    const savedConfig = await DBService.saveWebsiteConfig(websiteConfig);
    
    if (!savedConfig) {
      return NextResponse.json({ success: false, message: 'Failed to save website configuration' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data: savedConfig });
  } catch (error) {
    console.error('Error saving website config:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
} 