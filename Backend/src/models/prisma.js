const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcrypt");
const logger = require('../utils/logger'); // Import Winston logger

const prisma = new PrismaClient();

// Ensure description exists
async function createProgramme() {
  try {
    const programme = await prisma.programme.create({
      data: {
        name: "Full Stack",
        description: "Fiji",
        active: true,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
      },
    });
    logger.info(`Programme created: ${JSON.stringify(programme)}`);
  } catch (error) {
    logger.error(`Error creating programme: ${error.message}`);
  }
}

async function createLearners() {
  try {
    const learners = await prisma.learner.createMany({
      data: [
        {
          employeeNumber: "S12345",
          firstname: "John",
          lastname: "Doe",
          email: "johndoe@shaper.co.za",
          contactNo: "000-223-2232",
          emergencyNo: "000-303-2030",
          image: "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
          description: "2024",
          geolocation: '{"latitude":40.7128,"longitude":-74.0060}',
          isActive: true,
        },
      ],
      skipDuplicates: true,
    });

    logger.info(`Learners created: ${learners.count}`);
  } catch (error) {
    logger.error(`Error creating learners: ${error.message}`);
  }
}

async function createAdmins() {
  try {
    const plainPassword = "@dmin@dmin@shaper@1001";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const administrator = await prisma.admin.create({
      data: {
        email: "superadmin@shaper.co.za",
        password: hashedPassword,
        role: "super_admin",
      },
    });

    logger.info(`Admin created: ${administrator.email}`);
  } catch (error) {
    logger.error(`Error creating admin: ${error.message}`);
  }
}

const publicHolidays = new Set([
  "2024-01-01",
  "2024-03-21",
  "2024-04-27",
]);

function isWeekend(date) {
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek === 6 || dayOfWeek === 0;
}

async function getTotalSessions() {
  try {
    const uniqueWorkingDays = await prisma.attendance.findMany({
      select: { checkinAt: true },
      distinct: ['checkinAt'],
    });

    const workingDays = uniqueWorkingDays.filter((attendance) => {
      const checkinDate = new Date(attendance.checkinAt).toISOString().split('T')[0];
      return !publicHolidays.has(checkinDate) && !isWeekend(checkinDate);
    });

    const totalWorkingDays = workingDays.length;
    const totalSessions = await prisma.attendance.count();

    logger.info(`Total working days: ${totalWorkingDays}`);
    logger.info(`Total sessions: ${totalSessions}`);

    return { totalWorkingDays, totalSessions };
  } catch (error) {
    logger.error(`Error calculating sessions: ${error.message}`);
  }
}

async function main() {
  await createProgramme();
  await createAdmins();
  await createLearners();
  await getTotalSessions();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    logger.info("Database connection closed.");
  })
  .catch(async (error) => {
    logger.error(`Error in main function: ${error.message}`);
    await prisma.$disconnect();
    process.exit(1);
  });

module.exports = prisma;
