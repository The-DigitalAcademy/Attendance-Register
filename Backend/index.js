require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const prisma = new PrismaClient();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}
function authenticateAdminToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.admin = admin; // Attach admin info to request
    next();
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.admin.role !== role) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    }
    next();
  };
}

// Route only accessible to authenticated admins
app.get('/admin/dashboard', authenticateAdminToken, async (req, res) => {
  const learners = await prisma.learner.findMany();
  res.json(learners);
});

// Route only accessible to "super_admin" role
app.post('/admin/create', authenticateAdminToken, authorizeRole('admin'), async (req, res) => {
  const { employeeNumber, name, surname, cohort, geolocation } = req.body;
  const learner = await prisma.learner.create({
    data: { employeeNumber, name, surname, cohort, geolocation },
  });
  res.json({ message: 'Learner created', learner });
});
app.post('/admin/register', async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        role: role || "admin"  // Default to "admin" if no role is provided
      }
    });
    res.json({ message: 'Admin registered', admin });
  } catch (error) {
    res.status(400).json({ message: 'Admin already exists or invalid data' });
  }
});



// Admin login
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET);
  res.json({ message: 'Login successful', token });
});
// CRUD routes for learners

// Create a new learner
app.post('/learners', authenticateToken, async (req, res) => {
  const { employeeNumber, name, surname, image, cohort, geolocation } = req.body;
  try {
    const learner = await prisma.learner.create({
      data: { employeeNumbe, name, surname, image, cohort, geolocation },
    });
    res.json(learner);
  } catch (error) {
    res.status(500).json({ message: 'Error creating learner', error });
  }
});

// Get all learners
app.get('/learners', authenticateToken, async (req, res) => {
  const learners = await prisma.learner.findMany();
  res.json(learners);
});

// Get a single learner
app.get('/learners/:id', authenticateToken, async (req, res) => {
  const learner = await prisma.learner.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.json(learner);
});

// Update a learner
app.put('/learners/:id', authenticateToken, async (req, res) => {
  const { employeeNumber, name, surname, image, cohort, geolocation } = req.body;
  try {
    const learner = await prisma.learner.update({
      where: { id: parseInt(req.params.id) },
      data: { employeeNumber, name, surname, image, cohort, geolocation },
    });
    res.json(learner);
  } catch (error) {
    res.status(500).json({ message: 'Error updating learner', error });
  }
});

// Delete a learner
app.delete('/learners/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.learner.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'learner deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting learner', error });
  }
});

// Serve the admin dashboard page
app.get('/dashboard', authenticateToken, async (req, res) => {
  const learners = await prisma.learner.findMany();
  res.render('dashboard', { learners });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
