/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contactNo` to the `Learner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Learner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyNo` to the `Learner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Learner" ADD COLUMN     "contactNo" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "emergencyNo" TEXT NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Programme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "Total_Learners" INTEGER NOT NULL,
    "Startdate" TIMESTAMP(3) NOT NULL,
    "EndDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "CheckinAt" TIMESTAMP(3) NOT NULL,
    "geolocation" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Programme_cohort_key" ON "Programme"("cohort");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employeeNumber_fkey" FOREIGN KEY ("employeeNumber") REFERENCES "Learner"("employeeNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_cohort_fkey" FOREIGN KEY ("cohort") REFERENCES "Programme"("cohort") ON DELETE RESTRICT ON UPDATE CASCADE;
