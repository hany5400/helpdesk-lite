const express = require('express');
const router = express.Router();
const {
  getSupportTickets,
  updateTicketStatus,
  assignTicket,
  getSupportStaffList
} = require('../controllers/supportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/support/staff -> Get list of support staff / managers for assignment
router.get('/staff', protect, authorize('support', 'manager'), getSupportStaffList);

// GET /api/support/tickets -> Support / Manager view
router.get('/tickets', protect, authorize('support', 'manager'), getSupportTickets);

// PUT /api/support/tickets/:id/status -> Support / Manager update ticket status
router.put('/tickets/:id/status', protect, authorize('support', 'manager'), updateTicketStatus);

// PUT /api/support/tickets/:id/assign -> Support / Manager assign ticket
router.put('/tickets/:id/assign', protect, authorize('support', 'manager'), assignTicket);

module.exports = router;
