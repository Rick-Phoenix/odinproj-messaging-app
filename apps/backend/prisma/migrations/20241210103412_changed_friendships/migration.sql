/*
  Warnings:

  - The primary key for the `ChatInstance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ChatInstance` table. All the data in the column will be lost.
  - The primary key for the `FriendRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FriendRequest` table. All the data in the column will be lost.
  - Added the required column `text` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatInstance" DROP CONSTRAINT "ChatInstance_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ChatInstance_pkey" PRIMARY KEY ("userId", "chatId");

-- AlterTable
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("user1Id", "user2Id");

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "text" TEXT NOT NULL;
