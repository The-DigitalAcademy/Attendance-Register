const prisma = require('../models/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailService = require('../services/mailService');

exports.registerAdmin = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { email, password: hashedPassword, role: role || 'admin' },
    });

    await mailService.sendActivationEmail(email, admin.id);

    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(400).json({ message: 'Error registering admin', error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json({ admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.admin.delete({ where: { id: parseInt(id, 10) } });
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Error deleting admin', error: error.message });
  }
};

exports.updateAdminRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const updatedAdmin = await prisma.admin.update({
      where: { id: parseInt(id, 10) },
      data: { role },
    });
    res.json({ message: 'Admin role updated successfully', updatedAdmin });
  } catch (error) {
    console.error('Error updating admin role:', error);
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

exports.adminDashboard = async (req, res) => {
  try {
    const { active } = req.query;
    const isActive = active === 'true';

    const [activeLearners, inactiveLearners, programmes, admins] = await Promise.all([
      prisma.learner.findMany({ where: { isActive: true } }),
      prisma.learner.findMany({ where: { isActive: false } }),
      prisma.programme.findMany(),
      prisma.admin.findMany(),
    ]);

    res.json({
      totalLearners: activeLearners.length + inactiveLearners.length,
      activeLearners,
      totalActiveLearners: activeLearners.length,
      inactiveLearners,
      allProgrammes: programmes,
      totalProgrammes: programmes.length,
      allAdmins: admins,
      totalAdmins: admins.length,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
};
