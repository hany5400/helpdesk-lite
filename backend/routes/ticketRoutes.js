const express = require('express');
const router = express.Router();
const {
  createTicket,
  getEmployeeTickets,
  getTicketById
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/tickets -> employee/user gets their own tickets
router.get('/', protect, authorize('employee', 'support', 'manager'), getEmployeeTickets);

// POST /api/tickets -> employee/user creates new ticket
router.post('/', protect, authorize('employee', 'support', 'manager'), createTicket);

// GET /api/tickets/:id -> accessible by employee (own), support, or manager
router.get('/:id', protect, getTicketById);

module.exports = router;
