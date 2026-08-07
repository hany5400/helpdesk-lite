const express = require('express');
const router = express.Router();
const { getManagerDashboard } = require('../controllers/managerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/manager/dashboard -> Manager view only
router.get('/dashboard', protect, authorize('manager'), getManagerDashboard);

module.exports = router;
