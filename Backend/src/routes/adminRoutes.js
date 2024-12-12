const express = require('express');
const { registerAdmin, loginAdmin, adminDashboard, getAdmins, updateAdminRole } = require('../controllers/adminController');
const { authenticateAdminToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.post('/admin/all', authenticateAdminToken, authorizeRole('admin', 'super_admin'), getAdmins)
router.put('/admin/role/:id', authenticateAdminToken, authorizeRole('super_admin'),updateAdminRole)
router.get('/admin/dashboard', authenticateAdminToken, authorizeRole('admin', 'super_admin'), adminDashboard)
module.exports = router;
