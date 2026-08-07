const { pool } = require('../config/db');

const ticketModel = {
  /**
   * Create a new support ticket
   */
  create: async ({ employee_id, title, description, category, priority }) => {
    const [result] = await pool.query(
      `INSERT INTO tickets (employee_id, title, description, category, priority, status)
       VALUES (?, ?, ?, ?, ?, 'To Do')`,
      [employee_id, title, description, category, priority || 'Medium']
    );
    return result.insertId;
  },

  /**
   * Get all tickets created by a specific employee
   */
  getByEmployeeId: async (employeeId) => {
    const [rows] = await pool.query(
      `SELECT t.*, u_assign.name as assigned_to_name
       FROM tickets t
       LEFT JOIN users u_assign ON t.assigned_to = u_assign.id
       WHERE t.employee_id = ?
       ORDER BY t.created_at DESC`,
      [employeeId]
    );
    return rows;
  },

  /**
   * Get ticket by ID with detailed creator & assignee information
   */
  getById: async (id) => {
    const [rows] = await pool.query(
      `SELECT t.*,
              u_emp.name as employee_name,
              u_emp.email as employee_email,
              u_assign.name as assigned_to_name,
              u_assign.email as assigned_to_email
       FROM tickets t
       JOIN users u_emp ON t.employee_id = u_emp.id
       LEFT JOIN users u_assign ON t.assigned_to = u_assign.id
       WHERE t.id = ?`,
      [id]
    );
    return rows[0];
  },

  /**
   * Get all tickets for Support Staff / Manager views
   */
  getAllForSupport: async () => {
    const [rows] = await pool.query(
      `SELECT t.*,
              u_emp.name as employee_name,
              u_emp.email as employee_email,
              u_assign.name as assigned_to_name
       FROM tickets t
       JOIN users u_emp ON t.employee_id = u_emp.id
       LEFT JOIN users u_assign ON t.assigned_to = u_assign.id
       ORDER BY 
         CASE t.priority
           WHEN 'High' THEN 1
           WHEN 'Medium' THEN 2
           WHEN 'Low' THEN 3
         END,
         t.created_at DESC`
    );
    return rows;
  },

  /**
   * Update status and optional support assignment
   */
  updateStatus: async (id, status, assigned_to = undefined) => {
    if (assigned_to !== undefined) {
      const [result] = await pool.query(
        'UPDATE tickets SET status = ?, assigned_to = ? WHERE id = ?',
        [status, assigned_to, id]
      );
      return result.affectedRows > 0;
    } else {
      const [result] = await pool.query(
        'UPDATE tickets SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    }
  },

  /**
   * Get aggregated stats for Manager Dashboard
   */
  getManagerStats: async () => {
    // Total tickets count
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM tickets');
    
    // Open tickets (To Do)
    const [[{ open }]] = await pool.query("SELECT COUNT(*) as open FROM tickets WHERE status = 'To Do'");
    
    // In Progress & In Review
    const [[{ in_progress }]] = await pool.query("SELECT COUNT(*) as in_progress FROM tickets WHERE status IN ('In Progress', 'In Review')");
    
    // Closed / Done
    const [[{ closed }]] = await pool.query("SELECT COUNT(*) as closed FROM tickets WHERE status = 'Done'");

    // Breakdown by Status
    const [byStatus] = await pool.query(
      `SELECT status, COUNT(*) as count FROM tickets GROUP BY status`
    );

    // Breakdown by Priority
    const [byPriority] = await pool.query(
      `SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority`
    );

    // Breakdown by Category
    const [byCategory] = await pool.query(
      `SELECT category, COUNT(*) as count FROM tickets GROUP BY category ORDER BY count DESC`
    );

    // Recent Tickets
    const [recentTickets] = await pool.query(
      `SELECT t.id, t.title, t.category, t.priority, t.status, t.created_at, u.name as employee_name
       FROM tickets t
       JOIN users u ON t.employee_id = u.id
       ORDER BY t.created_at DESC
       LIMIT 5`
    );

    return {
      total,
      open,
      in_progress,
      closed,
      byStatus,
      byPriority,
      byCategory,
      recentTickets
    };
  }
};

module.exports = ticketModel;
