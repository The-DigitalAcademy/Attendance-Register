const express = require('express');
const { recordCheckin, getAttendance, getMonthlyAttendance } = require('../controllers/attendanceController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/checkin', authenticateToken, recordCheckin);
router.get('/:employeeNumber', authenticateToken, getAttendance);
router.get('/:employeeNumber/:month', authenticateToken, getMonthlyAttendance);

module.exports = router;
