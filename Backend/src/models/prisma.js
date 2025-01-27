const prisma = require('../../model');
const bcrypt = require("bcrypt");


//Ensure description Exists
async function createProgramme() {
try{
  const programme= await prisma.programme.create({

  data: {
    name: "Full Stack",
    description: "Fiji",
    active: true,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-12-31"),
  },
   
});
console.log(programme)
} catch (error) {
  console.error("Error creating Programme:", error);
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
        {
          employeeNumber: "S12346",
          firstname: "Jane",
          lastname: "Doe",
          email: "janedoe@shaper.co.za",
          contactNo: "000-223-2233",
          emergencyNo: "000-303-2031",
          image: "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
          description: "2024",
          geolocation: '{"latitude":40.7129,"longitude":-74.0059}',
          isActive: true,
        },
        {
          employeeNumber: "S12347",
          firstname: "Bob",
          lastname: "Doe",
          email: "bobdoe@shaper.co.za",
          contactNo: "000-223-2234",
          emergencyNo: "000-303-2032",
          image: "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
          description: "2024",
          geolocation: '{"latitude":40.7130,"longitude":-74.0058}',
          isActive: true,
        },
        {
          employeeNumber: "S12348",
          firstname: "Janet",
          lastname: "Doe",
          email: "janetdoe@shaper.co.za",
          contactNo: "000-223-2235",
          emergencyNo: "000-303-2033",
          image: "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
          description: "2024",
          geolocation: '{"latitude":40.7131,"longitude":-74.0057}',
          isActive: true,
        },
      ],
      skipDuplicates: true, // Prevents duplication errors if records already exist
    });

    console.log("Learners created:", learners);
  } catch (error) {
    console.error("Error creating learners:", error);
  }
}



async function createAdmins() {
  try {
    // Define the plain-text password
    const plainPassword = "@dmin@dmin@shaper@1001";

    // Generate a salt and hash the password
    const saltRounds = 10; // Adjust the cost factor as needed
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Create the admin with the hashed password
    const administrator = await prisma.admin.create({
      data: {
        email: "superadmin@shaper.co.za",
        password: hashedPassword, // Store the hashed password
        role: "super_admin", // Optional, defaults to "admin"
      },
    });

    console.log("Admin created:", administrator);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect(); // Disconnect the Prisma client
  }
}

// List of public holidays for South Africa TO BE expanded
const publicHolidays = [
  "2024-01-01", // New Year's Day
  "2024-03-21", // Human Rights Day
  "2024-04-27", // Freedom Day
  // TODO more public holidays here...
];

// Function to check if a date is a weekend (Saturday or Sunday)
function isWeekend(date) {
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek === 6 || dayOfWeek === 0; // Saturday or Sunday
}

// Function to calculate total working days and total sessions
async function getTotalSessions() {
  try {
    // Step 1: Get all unique checkinAt dates (date portion only)
    const uniqueWorkingDays = await prisma.attendance.findMany({
      select: {
        checkinAt: true,
      },
      distinct: ['checkinAt'],
    });

    // Step 2: Filter out weekends and public holidays
    const workingDays = uniqueWorkingDays.filter((attendance) => {
      const checkinDate = new Date(attendance.checkinAt).toISOString().split('T')[0]; // Extract date part (YYYY-MM-DD)

      const isHoliday = publicHolidays.includes(checkinDate); // Check if it's a public holiday
      const isWeekendDay = isWeekend(checkinDate); // Check if it's a weekend (Saturday or Sunday)

      return !isHoliday && !isWeekendDay; // Only keep working days (not public holidays or weekends)
    });

    // Count the number of valid working days
    const totalWorkingDays = workingDays.length;

 // Count the total number of sessions (attendance records)
    const totalSessions = await prisma.attendance.count();

    // Log the results for debugging
    console.log("Total working days:", totalWorkingDays);
    console.log("Total sessions:", totalSessions);

    return {
      totalWorkingDays,
      totalSessions,
    };
  } catch (error) {
    console.error("Error calculating sessions:", error);
  }
}



async function main() {
  await createProgramme();
  await createAdmins();
  await createLearners();
 getTotalSessions().then(result => {
  console.log("Result:", result);
});
}

// Run the main function
main()
  .then(async () => {
    await prisma.$disconnect(); // Disconnect Prisma after operations
  })
  .catch(async (error) => {
    console.error("Error in main function:", error);
    await prisma.$disconnect();
    process.exit(1); // Exit with failure
  });
  module.exports = prisma;