require('dotenv').config();
const express = require('express');
const path = require('path');
const adminRoutes = require('./src/routes/adminRoutes');
const learnerRoutes = require('./src/routes/learnerRoutes');
const { authenticateAdminToken } = require('./src/middleware/authMiddleware');
const prisma = require("./model")
const app = express();

// Middleware
app.use(express.json());0
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.admin.role !== role) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    }
    next();
  };
}
// Routes
app.use('/admin', adminRoutes);
app.use('/learners', learnerRoutes);


// Create a new learner
app.post('/learners/newlearner',  authenticateAdminToken, authorizeRole('admin'),
 async (req, res) => {
  const { employeeNumber, name, surname, email, contactNo, emergencyNo, cohort, geolocation } = req.body;
  try{
  const learner = await prisma.learner.create({
    data: { employeeNumber, name, surname, email, contactNo, emergencyNo,  cohort, geolocation },
  });
  res.json({ message: 'Learner created', learner });
  }catch(error){
  console.error("error registering a learner", error)
  }
});
// Get all learners
app.get('/learners', authorizeRole('admin'), async (req, res) => {
  const learners = await prisma.learner.findMany();
  res.json(learners);
});
// Get a single learner
app.get('/learner/:employeeNumber', authorizeRole('admin'), async (req, res) => {
  const { employeeNumber } = req.params;
  const learner = await prisma.learner.findUnique({
    where:  {employeeNumber: employeeNumber},
  });
  res.json(learner);
});
app.put('/learner/:employeeNumber', authenticateAdminToken, authorizeRole('admin'), async (req, res) => {
  const { employeeNumber, name, surname, image, cohort, geolocation } = req.body;
  try {
    const learner = await prisma.learner.update({
      where:  {employeeNumber: employeeNumber},
      data: { employeeNumber, name, surname, image, cohort, geolocation },
    });
    res.json(learner);
  } catch (error) {
    res.status(500).json({ message: 'Error updating learner', error });
  }
});
// Route to soft delete a learner using employeeNumber
app.put('/admin/learner/soft-delete/:employeeNumber',  authenticateAdminToken, authorizeRole('admin'), async (req, res) => {
  const { employeeNumber } = req.params; // Get the employeeNumber from the route parameters
  
  try {
    // Find the learner by employeeNumber and update their `isActive` status to false
    const updatedLearner = await prisma.learner.update({
      where: {
        employeeNumber: employeeNumber, // Use employeeNumber to find the learner
      },
      data: {
        isActive: false, // Mark the learner as inactive (soft delete)
      },
    });
    // Return a success message along with the updated learner data
    res.json({
      message: `Learner with Employee Number ${employeeNumber} has been soft deleted.`,
      learner: updatedLearner,
    });
    console.log(`Learner with Employee Number ${employeeNumber} has been soft deleted.`);
  } catch (error) {
    console.error('Error soft deleting learner:', error);
    res.status(500).json({ error: 'Error soft deleting learner' });
  }
});
app.get('/admin/dashboard', authenticateAdminToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { active } = req.query; // Read `active` parameter from query string (e.g., ?active=true)
    
    // Convert the query string to a boolean, default to `true` if `active` is not provided
    const isActive = active === 'true'; // Query parameters are strings, so we check for 'true'
    
    // Fetch learners who are active in the programme
    const activeLearners = await prisma.learner.findMany({
      where: {
        isActive: isActive, // Filtering based on the isActive boolean field
      },
    });
    // Fetch all programmes (if needed)
    const programmes = await prisma.programme.findMany();
    // Fetch all admins (if needed)
    const admins = await prisma.admin.findMany();
    // Return a list of all data
    res.json({
      totalLearners: activeLearners.length,
      allLearners: activeLearners,
      totalProgrammes: programmes ? programmes.length : 0,
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
});
//Get learner by check in
app.get('/learner/:employeeNumber/attendance', authenticateAdminToken, authorizeRole('admin'), async (req, res) => {
  const { employeeNumber } = req.params;
  try {
    // Fetch total expected check-ins for the cohort/program
    const learner = await prisma.learner.findUnique({
      where: { employeeNumber },
      include: { programme: true }, // Assuming learner is related to a program
    });
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }
    // Fetch actual check-ins
    const checkins = await prisma.attendance.count({
      where: { employeeNumber },
    });
    // Assuming `programme.totalLearners` represents total expected sessions:
    const totalExpectedSessions = 0; // Adjust based on your schema
    // Calculate missed sessions
    const missedCheckins = totalExpectedSessions - checkins;
    res.json({
      learner: {
        name: `${learner.name} ${learner.surname}`,
        cohort: learner.cohort,
      },
      totalCheckins: checkins,
      missedCheckins: missedCheckins > 0 ? missedCheckins : 0, // Avoid negative values
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching attendance data', error });
  }
});
//Get a learner by employeeNumnber and month of attendance
app.get('/learner/:employeeNumber/attendance/:month',  authenticateAdminToken, authorizeRole('admin'), async (req, res) => {
  const { employeeNumber, month } = req.params;
  try {
    // Parse the current year and the month from the request
    const year = new Date().getFullYear(); // Optional: Adjust for dynamic year parsing
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    // Fetch attendance data within the specified month
    const attendance = await prisma.attendance.findMany({
      where: {
        employeeNumber,
        checkinAt: {
          gte: startDate, // Greater than or equal to start of the month
          lt: endDate,    // Less than the start of the next month
        },
      },
    });
    // Format and respond with the attendance data
    res.json({
      employeeNumber,
      month,
      totalCheckins: attendance.length,
      checkins: attendance.map((entry) => ({
        date: entry.checkinAt,
        geolocation: entry.geolocation,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching attendance data', error });
  }
});


app.get('/admins', authenticateAdminToken, authorizeRole('super_admin'), async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error });
  }
});
app.put('/admin/role/:id', authenticateAdminToken, authorizeRole('super_admin'), async (req, res) => {
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
});
// Check-in Route for Learners by employeeNumber
app.post('/learner/checkin', async (req, res) => {
  const { employeeNumber, geolocation } = req.body;
  // Validate input
  if (!employeeNumber || !geolocation) {
    return res.status(400).json({ error: 'Missing required fields: employeeNumber and geolocation' });
  }
  try {
    // Check if the learner exists
    const learner = await prisma.learner.findUnique({
      where: { employeeNumber }, // Find learner by employeeNumber
    });
    if (!learner) {
      return res.status(404).json({ error: 'Learner not found' });
    }
    // Check if the learner has already checked in today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the day (midnight)
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of the day (11:59 PM)
    const existingCheckin = await prisma.attendance.findFirst({
      where: {
        employeeNumber, // Check if there's already a check-in for the learner today
        checkinAt: {
          gte: startOfDay,  // Greater than or equal to midnight
          lte: endOfDay,    // Less than or equal to 11:59 PM
        },
      },
    });
    if (existingCheckin) {
      return res.status(400).json({ error: 'You have already checked in today' });
    }
    // Create the attendance record
    const checkin = await prisma.attendance.create({
      data: {
        geolocation,
        checkinAt: new Date(), // Set check-in time to the current time
        learner: {
          connect: { employeeNumber },  // Connect learner via employeeNumber
        },
        programme: {
          connect: { cohort: learner.cohort },  // Connect programme via cohort
        },
      },
    });
    return res.status(201).json({ message: 'Check-in successful', checkin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

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
