/*
  Warnings:

  - You are about to drop the column `categoryId` on the `ProfileCategoryMap` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileCategoryMap" DROP CONSTRAINT "ProfileCategoryMap_categoryId_fkey";

-- AlterTable
ALTER TABLE "ProfileCategoryMap" DROP COLUMN "categoryId",
ADD COLUMN     "categoryIds" INTEGER[];
