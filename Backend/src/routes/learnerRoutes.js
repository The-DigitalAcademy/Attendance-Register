const express = require('express');
const { createLearner, getLearners, getLearnerByEmpNo, getLearnerAttendance, updateLearnerByEmpNo, softDelete, learnerCheckin, getLearnerAttendByMonth,  } = require('../controllers/learnerController');
const { authenticateAdminToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/all' ,getLearners);
router.get('/learner/:employeeNumber',getLearnerByEmpNo);
router.post('/learner/checkin', learnerCheckin)
router.get('/admin/learner/attendance/:employeeNumber',  getLearnerAttendance)
router.get('/learner/:employeeNumber/attendance/:month', getLearnerAttendByMonth)
router.post('/newlearner', createLearner);
router.put('/admin/learner/:employeeNumber',  updateLearnerByEmpNo)
// Route to soft delete a learner using employeeNumber
router.put('/admin/learner/soft-delete/:employeeNumber',  authenticateAdminToken, authorizeRole('super_admin'), softDelete);

module.exports = router;
