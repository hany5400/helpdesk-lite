const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// ===============================
// MySQL Connection Pool
// ===============================

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306', 10),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'helpdesk_db',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           'Z'
});

// ===============================
// Test Connection Helper
// ===============================

const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('[MySQL] Connected successfully to database:', process.env.DB_NAME || 'helpdesk_db');
    conn.release();
  } catch (error) {
    console.error('[MySQL Error] Failed to connect to MySQL server:', error.message);
    throw error;
  }
};

module.exports = { pool, testConnection };