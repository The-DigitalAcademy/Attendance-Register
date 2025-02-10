const express = require('express');
const { registerAdmin, loginAdmin, adminDashboard, getAdmins, updateAdminRole, generateReport } = require('../controllers/adminController');
const { authenticateAdminToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerAdmin); 
router.post('/admin/login', loginAdmin);
router.get('/admin/all', getAdmins)
router.put('/admin/role/:id', updateAdminRole)
router.get('/admin/dashboard', adminDashboard)
router.post('/generate-report', generateReport);
module.exports = router;
