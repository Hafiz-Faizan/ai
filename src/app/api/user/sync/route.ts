import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '../../../../lib/db';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { clerkId, email, name } = await request.json();
    
    if (!clerkId || !email || !name) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get database connection
    const connection = await pool.getConnection();
    
    try {
      // Check if user already exists by Clerk ID
      const [existingUsersByClerkId] = await connection.execute(
        'SELECT id, name, email, created_at FROM users WHERE clerk_id = ?',
        [clerkId]
      );
      
      // Type assertion for existingUsersByClerkId array
      const existingUsersByClerkIdArray = existingUsersByClerkId as Array<{
        id: number;
        name: string;
        email: string;
        created_at: Date;
      }>;
      
      // If user exists by Clerk ID, update their info
      if (existingUsersByClerkIdArray.length > 0) {
        await connection.execute(
          'UPDATE users SET name = ?, email = ? WHERE clerk_id = ?',
          [name, email, clerkId]
        );
        
        const userData = existingUsersByClerkIdArray[0];
        
        connection.release();
        
        return NextResponse.json({
          message: 'User updated successfully',
          user: {
            id: userData.id,
            name: name, // Use updated name
            email: email, // Use updated email
            createdAt: userData.created_at,
            clerkId
          }
        });
      }
      
      // Check if user exists by email
      const [existingUsersByEmail] = await connection.execute(
        'SELECT id, name, email, created_at, auth_type FROM users WHERE email = ?',
        [email]
      );
      
      // Type assertion for existingUsersByEmail array
      const existingUsersByEmailArray = existingUsersByEmail as Array<{
        id: number;
        name: string;
        email: string;
        created_at: Date;
        auth_type: string;
      }>;
      
      // If user exists by email, link their account with Clerk
      if (existingUsersByEmailArray.length > 0) {
        await connection.execute(
          'UPDATE users SET clerk_id = ?, auth_type = ?, name = ? WHERE email = ?',
          [clerkId, 'clerk', name, email]
        );
        
        const userData = existingUsersByEmailArray[0];
        
        connection.release();
        
        return NextResponse.json({
          message: 'User linked with Clerk successfully',
          user: {
            id: userData.id,
            name: name, // Use updated name
            email: email,
            createdAt: userData.created_at,
            clerkId
          }
        });
      }
      
      // Insert new user
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, clerk_id, auth_type, created_at) VALUES (?, ?, ?, ?, NOW())',
        [name, email, clerkId, 'clerk']
      );
      
      // Type assertion for result
      const insertResult = result as { insertId: number };
      const userId = insertResult.insertId;
      
      connection.release();
      
      return NextResponse.json({
        message: 'User created successfully',
        user: {
          id: userId,
          name,
          email,
          createdAt: new Date(),
          clerkId
        }
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('User sync error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 