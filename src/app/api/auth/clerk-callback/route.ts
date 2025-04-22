import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

// Create database connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'fazi12345',
  database: process.env.MYSQL_DATABASE || 'webify',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    // Get authentication data from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user data from request (sent by client)
    const { email, name, authSource } = await request.json();
    
    if (!email || !name) {
      return NextResponse.json(
        { message: 'Email and name are required' },
        { status: 400 }
      );
    }
    
    // Get database connection
    connection = await pool.getConnection();
    
    // Check if user exists by email
    const [existingUsers] = await connection.execute(
      'SELECT id, name, email, auth_type FROM users WHERE email = ?',
      [email]
    );
    
    // Type assertion for existing users array
    const existingUsersArray = existingUsers as Array<{
      id: number;
      name: string;
      email: string;
      auth_type: string;
    }>;
    
    let userId_db: number;
    
    // If user exists, update their Clerk ID
    if (existingUsersArray.length > 0) {
      const user = existingUsersArray[0];
      userId_db = user.id;
      
      // Update user with Clerk ID
      await connection.execute(
        'UPDATE users SET clerk_id = ?, auth_type = ? WHERE id = ?',
        [userId, authSource || 'clerk', userId_db]
      );
    } else {
      // Insert new user
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, clerk_id, auth_type, created_at) VALUES (?, ?, ?, ?, NOW())',
        [name, email, userId, authSource || 'clerk']
      );
      
      // Type assertion for result
      const insertResult = result as { insertId: number };
      userId_db = insertResult.insertId;
    }
    
    // Create JWT token with both Clerk ID and database user ID
    const token = jwt.sign(
      { 
        userId: userId_db,
        clerkId: userId,
        email,
        name
      },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '7d' }
    );
    
    // Release connection
    connection.release();
    
    // Create response
    const response = NextResponse.json({
      message: 'Authentication successful',
      user: {
        id: userId_db,
        name,
        email,
        clerkId: userId
      }
    });
    
    // Set cookie with token
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Clerk callback error:', error);
    
    // Release connection if it exists
    if (connection) {
      connection.release();
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 