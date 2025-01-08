require('dotenv').config();
const express = require('express');
const path = require('path');

// Import routes
const adminRoutes = require('./src/routes/adminRoutes');
const learnerRoutes = require('./src/routes/learnerRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/admin', adminRoutes);
app.use('/learners', learnerRoutes);
app.use('/attendance', attendanceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 35050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
