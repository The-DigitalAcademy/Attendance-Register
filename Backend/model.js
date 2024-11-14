const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createStudent() {
  const student = await prisma.learner.create({
    data: {
      employeeNumber: "S12345",
      name: "John",
      surname: "Doe",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQFW8F_Pr4ZUdw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723014220590?e=1736985600&v=beta&t=0gfSMF_75P5KRde507O6Zju6b8eVgnKRvnWH20d7KvI",
      cohort: 2024,
      geolocation: '{"latitude":40.7128,"longitude":-74.0060}',
    },
  });

  console.log(student);
}

createStudent();

