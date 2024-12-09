require('dotenv').config();
const express = require('express');
const path = require('path');
const adminRoutes = require('./src/routes/adminRoutes');
const learnerRoutes = require('./src/routes/learnerRoutes');

const app = express();

// Middleware
app.use(express.json());0
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/admin', adminRoutes);
app.use('/learners', learnerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err });
});

// Start server
const PORT = process.env.PORT || 35050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
