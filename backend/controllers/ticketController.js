const ticketModel = require('../models/ticketModel');

/**
 * @desc    Create a new support ticket
 * @route   POST /api/tickets
 * @access  Private (Employee)
 */
const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;
    const employee_id = req.user.id;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required.'
      });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    const ticketPriority = validPriorities.includes(priority) ? priority : 'Medium';

    const ticketId = await ticketModel.create({
      employee_id,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      priority: ticketPriority
    });

    const newTicket = await ticketModel.getById(ticketId);

    return res.status(201).json({
      success: true,
      message: 'Support ticket created successfully.',
      ticket: newTicket
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tickets for current logged-in employee
 * @route   GET /api/tickets
 * @access  Private (Employee)
 */
const getEmployeeTickets = async (req, res, next) => {
  try {
    const employee_id = req.user.id;
    const tickets = await ticketModel.getByEmployeeId(employee_id);

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single ticket by ID
 * @route   GET /api/tickets/:id
 * @access  Private (Employee / Support / Manager)
 */
const getTicketById = async (req, res, next) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) {
      return res.status(400).json({ success: false, message: 'Invalid ticket ID format.' });
    }

    const ticket = await ticketModel.getById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.'
      });
    }

    // Role check: Employees can only view their own tickets; Support and Managers can view any
    if (req.user.role === 'employee' && ticket.employee_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own tickets.'
      });
    }

    return res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getEmployeeTickets,
  getTicketById
};
