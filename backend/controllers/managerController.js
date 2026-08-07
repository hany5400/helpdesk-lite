const ticketModel = require('../models/ticketModel');

/**
 * @desc    Get aggregated stats for Manager Dashboard
 * @route   GET /api/manager/dashboard
 * @access  Private (Manager)
 */
const getManagerDashboard = async (req, res, next) => {
  try {
    const stats = await ticketModel.getManagerStats();

    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getManagerDashboard
};
