import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function isUsernameTaken(username) {
  const existingUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  return !!existingUsername;
}

export async function isEmailTaken(email) {
  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return !!existingEmail;
}

export async function createUser(username, email, hash, salt) {
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      hash,
      salt,
    },
  });

  return newUser;
}

export async function getUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user;
}

export async function createFriendRequest(userId, friendEmail) {
  const friendToAdd = await prisma.user.findUnique({
    where: {
      email: friendEmail,
    },
    include: {
      outgoingFriendRequests: true,
      incomingFriendRequests: true,
    },
  });

  if (!friendToAdd)
    return { error: "This email does not correspond to any user." };
  if (
    friendToAdd.outgoingFriendRequests.some(
      (request) => request.user2Id === userId
    )
  )
    return { error: "This user has already sent you a friend request." };
  if (
    friendToAdd.incomingFriendRequests.some(
      (request) => request.user1Id === userId
    )
  )
    return { error: "You have already sent a friend request to this user." };

  const addRequest = await prisma.friendRequest.create({
    data: {
      user1Id: userId,
      user2Id: friendToAdd.id,
    },
  });

  return true;
}

export async function fetchUserData(userId) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      username: true,
      chatInstances: {
        include: {
          chat: {
            include: {
              messages: {
                orderBy: { sentAt: "desc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  return userData;
}

export async function addFriendRequest(userId, friendEmail) {
  const newFriend = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      outgoingFriendRequests: { connect: { email: friendEmail } },
    },
  });
}

async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      outgoingFriendRequests: true,
      incomingFriendRequests: true,
      friendOf: true,
      friends: true,
    },
  });
}

async function deleteUser() {
  await prisma.user.delete({
    where: { id: 4 },
  });
}
