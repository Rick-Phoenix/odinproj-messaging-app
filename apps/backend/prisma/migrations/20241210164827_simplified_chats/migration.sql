/*
  Warnings:

  - You are about to drop the `ChatInstance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatInstance" DROP CONSTRAINT "ChatInstance_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatInstance" DROP CONSTRAINT "ChatInstance_userId_fkey";

-- DropTable
DROP TABLE "ChatInstance";
