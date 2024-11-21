/*
  Warnings:

  - You are about to drop the column `CheckinAt` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `Active` on the `Programme` table. All the data in the column will be lost.
  - You are about to drop the column `EndDate` on the `Programme` table. All the data in the column will be lost.
  - You are about to drop the column `Startdate` on the `Programme` table. All the data in the column will be lost.
  - You are about to drop the column `Total_Learners` on the `Programme` table. All the data in the column will be lost.
  - Added the required column `checkinAt` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Programme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Programme` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "CheckinAt",
ADD COLUMN     "checkinAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Programme" DROP COLUMN "Active",
DROP COLUMN "EndDate",
DROP COLUMN "Startdate",
DROP COLUMN "Total_Learners",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalLearners" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Learner" ADD CONSTRAINT "Learner_cohort_fkey" FOREIGN KEY ("cohort") REFERENCES "Programme"("cohort") ON DELETE RESTRICT ON UPDATE CASCADE;
