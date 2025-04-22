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
      // Get user by Clerk ID
      const [users] = await connection.execute(
        'SELECT id, name, email, created_at FROM users WHERE clerk_id = ?',
        [userId]
      );
      
      // Type assertion for users array
      const usersArray = users as Array<{
        id: number;
        name: string;
        email: string;
        created_at: Date;
      }>;
      
      if (usersArray.length === 0) {
        connection.release();
        return NextResponse.json(
          { message: 'User not found in database, sync required' },
          { status: 404 }
        );
      }
      
      const userData = usersArray[0];
      
      connection.release();
      
      return NextResponse.json({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        createdAt: userData.created_at,
        clerkId: userId
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 