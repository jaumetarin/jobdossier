/*
  Warnings:

  - You are about to drop the column `githubAccessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `githubId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Changelog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Repository` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Changelog" DROP CONSTRAINT "Changelog_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_userId_fkey";

-- DropIndex
DROP INDEX "User_githubId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "githubAccessToken",
DROP COLUMN "githubId";

-- DropTable
DROP TABLE "Changelog";

-- DropTable
DROP TABLE "Repository";

-- CreateTable
CREATE TABLE "JobOffer" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "modality" TEXT,
    "salaryText" TEXT,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "technologiesRaw" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFilter" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "keyword" TEXT,
    "location" TEXT,
    "modality" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFilter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobOffer_url_key" ON "JobOffer"("url");

-- AddForeignKey
ALTER TABLE "UserFilter" ADD CONSTRAINT "UserFilter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
