-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Learner" (
    "id" SERIAL NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "image" TEXT,
    "contactNo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emergencyNo" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geolocation" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Learner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "totalLearners" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "geolocation" TEXT NOT NULL,
    "checkinAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Learner_employeeNumber_key" ON "Learner"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Programme_cohort_key" ON "Programme"("cohort");

-- AddForeignKey
ALTER TABLE "Learner" ADD CONSTRAINT "Learner_cohort_fkey" FOREIGN KEY ("cohort") REFERENCES "Programme"("cohort") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_cohort_fkey" FOREIGN KEY ("cohort") REFERENCES "Programme"("cohort") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employeeNumber_fkey" FOREIGN KEY ("employeeNumber") REFERENCES "Learner"("employeeNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
