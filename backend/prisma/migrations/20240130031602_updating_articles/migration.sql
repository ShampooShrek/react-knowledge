/*
  Warnings:

  - Made the column `description` on table `Articles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Articles" ALTER COLUMN "description" SET NOT NULL;
