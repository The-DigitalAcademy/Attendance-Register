const express = require('express');
const { authenticateAdminToken, authorizeRole } = require('../middleware/authMiddleware');
const {createProgramme, getAllProgrammes}= require('../controllers/programmeController');


const router= express()

router.post('/new', createProgramme)
router.get('/all',getAllProgrammes)


module.exports = router;