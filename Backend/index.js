require('dotenv').config();
const express = require('express');
const path = require('path');
const adminRoutes = require('./src/routes/adminRoutes');
const learnerRoutes = require('./src/routes/learnerRoutes');
const programmeRoutes= require('./src/routes/programmeRoute')
const { authenticateAdminToken, authorizeRole } = require('./src/middleware/authMiddleware');
const prisma = require("./src/models/prisma")
const app = express();
const logger = require('./src/utils/logger'); 
// Middleware
app.use(express.json());0
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/v1/admins', adminRoutes);
app.use('/v1/learners', learnerRoutes);
app.use('/v1/programmes',programmeRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err });
});

// Start server
const PORT = process.env.PORT || 35050;
app.listen(PORT, () => {
  
  logger.info(`Server running on http://localhost:${PORT}`);
});
