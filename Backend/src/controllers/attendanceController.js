const prisma = require('../models/prisma');

// Record check-in
exports.recordCheckin = async (req, res, next) => {
  const { employeeNumber, geolocation } = req.body;

  try {
    const attendance = await prisma.attendance.create({
      data: {
        employeeNumber,
        geolocation,
        checkinAt: new Date(),
      },
    });

    res.status(201).json({ message: 'Check-in successful', attendance });
  } catch (error) {
    next(error);
  }
};

// Get attendance for a learner
exports.getAttendance = async (req, res, next) => {
  const { employeeNumber } = req.params;

  try {
    const attendance = await prisma.attendance.findMany({
      where: { employeeNumber },
    });

    res.json({ employeeNumber, attendance });
  } catch (error) {
    next(error);
  }
};

// Get monthly attendance
exports.getMonthlyAttendance = async (req, res, next) => {
  const { employeeNumber, month } = req.params;

  try {
    const year = new Date().getFullYear();
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const attendance = await prisma.attendance.findMany({
      where: {
        employeeNumber,
        checkinAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    res.json({ employeeNumber, month, attendance });
  } catch (error) {
    next(error);
  }
};
