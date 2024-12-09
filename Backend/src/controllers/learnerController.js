const prisma = require('../models/prisma');

exports.createLearner = async (req, res) => {
  const { employeeNumber, name, surname, email, contactNo, emergencyNo, cohort, geolocation } = req.body;

  try {
    const learner = await prisma.learner.create({
      data: { employeeNumber, name, surname, email, contactNo, emergencyNo, cohort, geolocation },
    });
    res.json({ message: 'Learner created', learner });
  } catch (error) {
    res.status(400).json({ message: 'Error creating learner', error });
  }
};


exports.getLearners = async (req, res) => {
  try {
    const learners = await prisma.learner.findMany();
    res.json(learners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learners', error });
  }
};
