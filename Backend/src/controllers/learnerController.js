const prisma = require('../models/prisma');
const mailService = require('../services/mailService');

exports.createLearner = async (req, res) => {
  const { employeeNumber,firstname, lastname, email, contactNo, emergencyNo, description, geolocation } = req.body;

  try {
    const learner = await prisma.learner.create({
      data: { employeeNumber,firstname, lastname, email, contactNo, emergencyNo, description, geolocation },
    });

    await mailService.onbordedEmail(email, learner.id,firstname, lastname);
    res.json({ message: 'Learner created', learner });

  } catch (error) {
    res.status(400).json({ message: 'Error creating learner', error });
  }
};


exports.getLearners = async (req, res) => {
  try {
    const learners = await prisma.learner.findMany();
    if (!learners || learners.length === 0) {
      return res.status(404).json({ message: 'No learners found' });
    }
    res.json(learners);
  } catch (error) {
    console.error("Error details:", error); 

    let errorMessage = 'Unknown error occurred';
    if (error) {
      errorMessage = error.message || 'Error object has no message property';
      if (error.stack) {
        console.error("Error stack trace:", error.stack); 
      }
    } 

    res.status(500).json({ 
      message: 'Error fetching learners', 
      details: errorMessage 
    }); 
  }
};

exports.getLearnerByEmpNo= async(req, res)=>{
  const { employeeNumber } = req.params;
  try{
  const learner = await prisma.learner.findUnique({
    where:  {employeeNumber: employeeNumber},
  });
  res.json({message: learner});
} catch{
  res.status(401).json({message: "Cannot get Learner with employee number: ", employeeNumber})
}
}
exports.getLearnerAttendance = async (req, res) => {
  const { employeeNumber } = req.params;
  try {
    // Fetch total expected check-ins for the description/program
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
       firstname: `${learner.name} ${learner.lastname}`,
        description: learner.description,
      },
      totalCheckins: checkins,
      missedCheckins: missedCheckins > 0 ? missedCheckins : 0, // Avoid negative values
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching attendance data', error });
  }
}
exports.learnerCheckin= async (req, res) => {
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
          connect: { description: learner.description },  // Connect programme via description
        },
      },
    });
    return res.status(201).json({ message: 'Check-in successful', checkin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

exports.getLearnerAttendByMonth=  async (req, res) => {
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
}

exports.updateLearnerByEmpNo =async (req, res) => {
  const { employeeNumber,firstname, lastname, image, description, geolocation } = req.body;
  try {
    const learner = await prisma.learner.update({
      where:  {employeeNumber: employeeNumber},
      data: { employeeNumber,firstname, lastname, image, description, geolocation },
    });
    res.json(learner);
  } catch (error) {
    res.status(500).json({ message: 'Error updating learner', error });
  }
}

exports.softDelete = async (req, res) => {
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
}