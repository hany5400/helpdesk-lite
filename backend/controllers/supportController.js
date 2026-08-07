const ticketModel = require('../models/ticketModel');

/**
 * @desc    Get tickets for Support Staff / Manager dashboard
 * @route   GET /api/support/tickets
 * @access  Private (Support / Manager)
 */
const getSupportTickets = async (req, res, next) => {
  try {
    const tickets = await ticketModel.getAllForSupport();

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
 * @desc    Update ticket status and optional assignee
 * @route   PUT /api/support/tickets/:id/status
 * @access  Private (Support / Manager)
 */
const updateTicketStatus = async (req, res, next) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    const { status, assigned_to } = req.body;

    if (isNaN(ticketId)) {
      return res.status(400).json({ success: false, message: 'Invalid ticket ID.' });
    }

    const validStatuses = ['To Do', 'In Progress', 'In Review', 'Done'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const ticket = await ticketModel.getById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.'
      });
    }

    // Auto-assign to current support staff if status changed to 'In Progress' and currently unassigned
    let assignee = assigned_to;
    if (assignee === undefined && status === 'In Progress' && !ticket.assigned_to) {
      assignee = req.user.id;
    }

    await ticketModel.updateStatus(ticketId, status, assignee);
    const updatedTicket = await ticketModel.getById(ticketId);

    return res.status(200).json({
      success: true,
      message: `Ticket status successfully updated to '${status}'.`,
      ticket: updatedTicket
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign ticket to a support staff member
 * @route   PUT /api/support/tickets/:id/assign
 * @access  Private (Support / Manager)
 */
const assignTicket = async (req, res, next) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    const { assigned_to } = req.body;

    if (isNaN(ticketId)) {
      return res.status(400).json({ success: false, message: 'Invalid ticket ID.' });
    }

    const ticket = await ticketModel.getById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    const assigneeId = assigned_to === null || assigned_to === '' ? null : parseInt(assigned_to, 10);

    await ticketModel.updateStatus(ticketId, ticket.status, assigneeId);
    const updatedTicket = await ticketModel.getById(ticketId);

    return res.status(200).json({
      success: true,
      message: 'Ticket assignee updated successfully.',
      ticket: updatedTicket
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get list of support staff for ticket assignment
 * @route   GET /api/support/staff
 * @access  Private (Support / Manager)
 */
const getSupportStaffList = async (req, res, next) => {
  try {
    const userModel = require('../models/userModel');
    const staff = await userModel.getSupportStaff();
    return res.status(200).json({
      success: true,
      staff
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSupportTickets,
  updateTicketStatus,
  assignTicket,
  getSupportStaffList
};
