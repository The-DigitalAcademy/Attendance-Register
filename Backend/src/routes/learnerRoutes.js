const express = require('express');
const { createLearner, getLearners, getLearnerByEmpNo, getLearnerAttendance, updateLearnerByEmpNo, softDelete, learnerCheckin, getLearnerAttendByMonth,  } = require('../controllers/learnerController');
const { authenticateAdminToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/newlearner', authenticateAdminToken, authorizeRole('admin', 'super_admin'), createLearner);
router.get('/all', getLearners);
router.get('/learner/:employeeNumber', authenticateAdminToken, authorizeRole('admin', 'super_admin'),getLearnerByEmpNo);
router.post('/learner/checkin', learnerCheckin)
router.get('/admin/learner/attendance', authenticateAdminToken,authorizeRole('admin', 'super_admin'),  getLearnerAttendance)
router.get('/learner/:employeeNumber/attendance/:month', authenticateAdminToken, authorizeRole('admin', 'super_admin'), getLearnerAttendByMonth)

router.put('/admin/learner/soft-delete/:employeeNumber',  authenticateAdminToken, authorizeRole('admin', 'super_admin'), updateLearnerByEmpNo)
// Route to soft delete a learner using employeeNumber
router.put('/admin/learner/soft-delete/:employeeNumber',  authenticateAdminToken, authorizeRole('admin', 'super_admin'), softDelete);

module.exports = router;
