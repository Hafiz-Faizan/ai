import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

// Create database connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'webify',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

interface JwtPayload {
  userId: number;
  email: string;
  name: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_jwt_secret'
      ) as JwtPayload;

      // Get user from database to ensure they still exist and get latest data
      const connection = await pool.getConnection();
      
      try {
        const [users] = await connection.execute(
          'SELECT id, name, email, created_at FROM users WHERE id = ?',
          [decoded.userId]
        );
        
        connection.release();
        
        // Type assertion for users array
        const usersArray = users as Array<{
          id: number;
          name: string;
          email: string;
          created_at: Date;
        }>;

        if (usersArray.length === 0) {
          // User no longer exists in database
          const response = NextResponse.json(
            { message: 'User not found' },
            { status: 404 }
          );
          
          // Clear the invalid token cookie
          response.cookies.set({
            name: 'token',
            value: '',
            httpOnly: true,
            expires: new Date(0),
            path: '/'
          });
          
          return response;
        }

        // Return user data (excluding sensitive information)
        const userData = usersArray[0];
        
        return NextResponse.json({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          createdAt: userData.created_at
        });
      } catch (error) {
        connection.release();
        throw error;
      }
    } catch (error) {
      // Token is invalid or expired
      const response = NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
      
      // Clear the invalid token cookie
      response.cookies.set({
        name: 'token',
        value: '',
        httpOnly: true,
        expires: new Date(0),
        path: '/'
      });
      
      return response;
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
 