const express = require('express');
const { registerAdmin, loginAdmin, adminDashboard, getAdmins, updateAdminRole, generateReport } = require('../controllers/adminController');
const { authenticateAdminToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authenticateAdminToken, authorizeRole('super_admin') , registerAdmin);
router.post('/admin/login', loginAdmin);
router.get('/admin/all',authenticateAdminToken, authorizeRole('super_admin') , getAdmins)
router.put('/admin/role/:id', authenticateAdminToken, authorizeRole('super_admin'),updateAdminRole)
router.get('/admin/dashboard', authenticateAdminToken, authorizeRole('admin', 'super_admin'), adminDashboard)
router.post('/generate-report', authenticateAdminToken, generateReport);
module.exports = router;
