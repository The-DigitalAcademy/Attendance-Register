const express = require('express');
const { createLearner, getLearners } = require('../controllers/learnerController');
const { authenticateAdminToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/newlearners', authenticateAdminToken, createLearner);
router.get('/', getLearners);

module.exports = router;
