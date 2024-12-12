const express = require('express');
const { authenticateAdminToken, authorizeRole } = require('../middleware/authMiddleware');
const {createProgramme, getAllProgrammes}= require('../controllers/programmeController');


const router= express()

router.post('/new',authenticateAdminToken, authorizeRole('admin', 'super_admin'), createProgramme)
router.get('/all', authenticateAdminToken, authorizeRole('admin', 'super_admin'),getAllProgrammes)


module.exports = router;