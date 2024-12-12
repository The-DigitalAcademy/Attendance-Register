const prisma = require('../models/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailService = require('../services/mailService');

exports.registerAdmin = async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.admin.create({
      data: { email, password: hashedPassword, role: role || 'admin' },
    });

    // Send activation email
    await mailService.sendActivationEmail(email, admin.id);

    res.json({ message: 'Admin registered', admin });
  } catch (error) {
    res.status(400).json({ message: 'Error registering admin', error });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};


exports.getAdmins=async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error });
  }
}

exports.deleteAdmins = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.admin.delete({ where: { id: parseInt(id, 10) } });
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error });
  }
}

exports.updateAdminRole =  async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const updatedAdmin = await prisma.admin.update({
      where: { id: parseInt(id, 10) },
      data: { role },
    });
    res.json({ message: 'Admin role updated successfully', updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error });
  }
}

exports.adminDashboard = async (req, res) => {
  try {
    const { active } = req.query; // Read `active` parameter from query string (e.g., ?active=true)
    
    // Convert the query string to a boolean, default to `true` if `active` is not provided
    const isActive = active === 'true'; // Query parameters are strings, so we check for 'true'
    
    // Fetch learners who are active in the programme
    const activeLearners = await prisma.learner.findMany({
      where: {
        isActive: true // Filtering based on the isActive boolean field
      },
    });
    const inActiveLearners = await prisma.learner.findMany({
      where: {
        isActive: false // Filtering based on the isActive boolean field
      },
    });
    // Fetch all programmes 
    const programmes = await prisma.programme.findMany();
    // Fetch all admins
    const admins = await prisma.admin.findMany();

    // Return a list of all data
    res.json({
      //allLearners: allLearners,
      totalLearners: activeLearners? activeLearners.length : 0,
      activeLearners: activeLearners,
      totalActiveLearners: activeLearners.length,
      inActiveLearners: inActiveLearners,
      allProgrammes: programmes,
      totalProgrammes: programmes ? programmes.length : 0,
      allAdmins: admins,
      totalAdmins: admins ? admins.length : 0,
    });
    
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
}