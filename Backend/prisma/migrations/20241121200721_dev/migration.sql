-- AlterTable
ALTER TABLE "Learner" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Programme" ALTER COLUMN "active" SET DEFAULT true;
