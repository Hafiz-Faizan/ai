import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '../../../../lib/db';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
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
          { message: 'User not found in database, sync required', stores: [] },
          { status: 200 }
        );
      }
      
      const userDbId = usersArray[0].id;
      
      // Now get the user's stores
      const [stores] = await connection.execute(
        'SELECT id, user_id, store_name, store_id, created_at FROM user_stores WHERE user_id = ? ORDER BY last_accessed DESC',
        [userDbId]
      );
      
      connection.release();
      
      return NextResponse.json({
        stores
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Get user stores error:', error);
    return NextResponse.json(
      { message: 'Internal server error', stores: [] },
      { status: 500 }
    );
  }
} 