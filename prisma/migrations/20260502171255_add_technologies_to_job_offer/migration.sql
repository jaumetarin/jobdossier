-- AlterTable
ALTER TABLE "JobOffer" ADD COLUMN     "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[];
