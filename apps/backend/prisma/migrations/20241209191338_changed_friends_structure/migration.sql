/*
  Warnings:

  - You are about to drop the `_Friend Requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Friends` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `friendsIds` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_Friend Requests" DROP CONSTRAINT "_Friend Requests_A_fkey";

-- DropForeignKey
ALTER TABLE "_Friend Requests" DROP CONSTRAINT "_Friend Requests_B_fkey";

-- DropForeignKey
ALTER TABLE "_Friends" DROP CONSTRAINT "_Friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_Friends" DROP CONSTRAINT "_Friends_B_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "participantsIds" INTEGER[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friendsIds" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_Friend Requests";

-- DropTable
DROP TABLE "_Friends";

-- CreateTable
CREATE TABLE "FriendRequest" (
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("user1Id","user2Id")
);

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
