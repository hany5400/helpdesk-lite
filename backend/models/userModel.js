const { pool } = require('../config/db');

const userModel = {
  /**
   * Find a user by email address
   */
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT id, name, email, password, role, created_at FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  /**
   * Find a user by ID (excluding password)
   */
  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  /**
   * Create a new user record
   */
  create: async ({ name, email, password, role }) => {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'employee']
    );
    return result.insertId;
  },

  /**
   * Get all users with support or manager role
   */
  getSupportStaff: async () => {
    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE role IN ('support', 'manager') ORDER BY name ASC"
    );
    return rows;
  }
};

module.exports = userModel;
