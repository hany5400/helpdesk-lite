const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'helpdesk_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

/**
 * Test MySQL database connection on server startup
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[MySQL] Connected successfully to database: ${process.env.DB_NAME || 'helpdesk_db'}`);
    connection.release();
  } catch (error) {
    console.error(`[MySQL Error] Failed to connect to MySQL server:`, error.message);
    console.error(`Please verify MySQL is running (e.g. XAMPP / WAMP / phpMyAdmin) and credentials in .env are correct.`);
  }
};

module.exports = {
  pool,
  testConnection
};
