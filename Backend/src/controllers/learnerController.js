const prisma = require('../models/prisma');

// Create a learner
exports.createLearner = async (req, res) => {
  const { employeeNumber, name, surname, email, contactNo, emergencyNo, cohort, geolocation } = req.body;

  try {
    const learner = await prisma.learner.create({
      data: { employeeNumber, name, surname, email, contactNo, emergencyNo, cohort, geolocation },
    });
    res.json({ message: 'Learner created successfully', learner });
  } catch (error) {
    res.status(400).json({ message: 'Error creating learner', error });
  }
};

// Get all learners
exports.getLearners = async (req, res) => {
  try {
    const learners = await prisma.learner.findMany();
    res.json(learners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learners', error });
  }
};

// Get a single learner
exports.getLearner = async (req, res) => {
  const { employeeNumber } = req.params;

  try {
    const learner = await prisma.learner.findUnique({ where: { employeeNumber } });
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }
    res.json(learner);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learner', error });
  }
};

// Update a learner
exports.updateLearner = async (req, res) => {
  const { employeeNumber } = req.params;
  const { name, surname, email, contactNo, emergencyNo, cohort, geolocation } = req.body;

  try {
    const updatedLearner = await prisma.learner.update({
      where: { employeeNumber },
      data: { name, surname, email, contactNo, emergencyNo, cohort, geolocation },
    });

    res.json({ message: 'Learner updated successfully', updatedLearner });
  } catch (error) {
    res.status(500).json({ message: 'Error updating learner', error });
  }
};

// Soft delete a learner
exports.softDeleteLearner = async (req, res) => {
  const { employeeNumber } = req.params;

  try {
    await prisma.learner.update({
      where: { employeeNumber },
      data: { isActive: false },
    });

    res.json({ message: `Learner ${employeeNumber} has been soft deleted.` });
  } catch (error) {
    res.status(500).json({ message: 'Error soft deleting learner', error });
  }
};
