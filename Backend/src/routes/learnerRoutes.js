const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { createLearner, getLearners, getLearner, updateLearner, softDeleteLearner } = require('../controllers/learnerController');

const router = express.Router();

router.post('/newlearners', authenticateToken, createLearner);
router.get('/', authenticateToken, getLearners);
router.get('/:employeeNumber', authenticateToken, getLearner);
router.put('/:employeeNumber', authenticateToken, updateLearner);
router.put('/soft-delete/:employeeNumber', authenticateToken, softDeleteLearner);

module.exports = router;
