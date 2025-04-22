import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '../../../../lib/db';
import crypto from 'crypto';

// POST endpoint to save a user's store
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { storeName } = await request.json();
    
    if (!storeName) {
      return NextResponse.json(
        { message: 'Store name is required' },
        { status: 400 }
      );
    }

    // Get database connection
    const connection = await pool.getConnection();
    
    try {
      // First, get user's ID from our database by Clerk ID
      const [users] = await connection.execute(
        'SELECT id FROM users WHERE clerk_id = ?',
        [userId]
      );
      
      // Type assertion for users array
      const usersArray = users as Array<{ id: number }>;
      
      if (usersArray.length === 0) {
        connection.release();
        return NextResponse.json(
          { message: 'User not found in database, sync required' },
          { status: 404 }
        );
      }
      
      const userDbId = usersArray[0].id;
      
      // Generate a unique ID for the store
      const storeId = crypto.randomBytes(16).toString('hex');
      
      // Create a new store
      const [result] = await connection.execute(
        'INSERT INTO user_stores (user_id, store_name, store_id, created_at, last_accessed) VALUES (?, ?, ?, NOW(), NOW())',
        [userDbId, storeName, storeId]
      );
      
      // Type assertion for result
      const insertResult = result as { insertId: number };
      const storeDbId = insertResult.insertId;
      
      connection.release();
      
      return NextResponse.json({
        message: 'Store created successfully',
        store: {
          id: storeDbId,
          store_id: storeId,
          store_name: storeName,
          user_id: userDbId,
          created_at: new Date()
        }
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Create store error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 