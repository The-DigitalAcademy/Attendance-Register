const express = require('express');
const { authenticateAdminToken, authorizeRole } = require('../middleware/authMiddleware');
const { registerAdmin, loginAdmin, updateRole, getAdmins } = require('../controllers/adminController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.put('/role/:id', authenticateAdminToken, authorizeRole('super_admin'), updateRole);
router.get('/', authenticateAdminToken, authorizeRole('super_admin'), getAdmins);

module.exports = router;
