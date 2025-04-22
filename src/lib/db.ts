import mysql from 'mysql2/promise';

// Create a single, reusable database connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'fazi12345',
  database: process.env.MYSQL_DATABASE || 'webify',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; 
 