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
      profile: true,
      username: true,
      pfpurl: true,
      friends: {
        select: {
          username: true,
          email: true,
          pfpurl: true,
        },
      },
      friendOf: {
        select: {
          username: true,
          email: true,
          pfpurl: true,
        },
      },
      incomingFriendRequests: {
        select: {
          status: true,
          user1: {
            select: {
              username: true,
              email: true,
              id: true,
            },
          },
        },
      },
      chats: {
        select: {
          name: true,
          id: true,
          chatPicUrl: true,
          messages: {
            orderBy: { sentAt: "desc" },
            take: 1,
          },
          participants: {
            select: {
              username: true,
              pfpurl: true,
            },
          },
        },
      },
    },
  });

  return userData;
}

export async function addAcceptedFriendRequest(userId, friendId) {
  const updatedFriend = await prisma.user.update({
    where: {
      id: friendId,
    },
    data: {
      friends: {
        connect: {
          id: userId,
        },
      },
    },
  });

  const acceptedRequest = await prisma.friendRequest.delete({
    where: {
      user1Id_user2Id: {
        user1Id: friendId,
        user2Id: userId,
      },
    },
  });

  return true;
}

export async function setRejectedFriendRequest(userId, requestingUserId) {
  const updatedRequest = await prisma.friendRequest.update({
    where: {
      user1Id_user2Id: {
        user1Id: requestingUserId,
        user2Id: userId,
      },
    },
    data: {
      status: "Rejected",
    },
  });

  return true;
}

export async function fetchProfile(username) {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      pfpurl: true,
      profile: true,
    },
  });

  if (!user) return false;
  if (!user.profile) return null;
  else return user;
}

export async function addOrEditProfile(userId, name, status, bio) {
  const profile = await prisma.profile.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      name,
      status,
      ...(bio && { bio }),
    },
    update: {
      name,
      status,
      ...(bio && { bio }),
    },
  });

  return profile;
}

export async function findOrCreateChat(userId, contactUsername) {
  const chat = await prisma.chat.findFirst({
    where: {
      participants: {
        every: {
          OR: [
            {
              id: {
                equals: userId,
              },
            },
            {
              username: {
                equals: contactUsername,
              },
            },
          ],
        },
      },
    },
    select: {
      id: true,
      participants: {
        select: {
          username: true,
          pfpurl: true,
        },
      },
      messages: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  if (chat) return chat;
  else {
    const newChat = await prisma.chat.create({
      data: {
        participants: {
          connect: [
            {
              id: userId,
            },
            {
              username: contactUsername,
            },
          ],
        },
      },
    });

    return newChat;
  }
}

export async function addMessage(userId, chatId, text) {
  const newMessage = await prisma.message.create({
    data: {
      userId,
      chatId,
      text,
    },
  });

  return true;
}

export async function addGroupChat(userId, chatName, usernames) {
  const newChat = await prisma.chat.create({
    data: {
      name: chatName,
      participants: {
        connect: [
          { id: userId },
          ...usernames.map((username) => {
            return { username };
          }),
        ],
      },
    },
  });

  return newChat.id;
}

export async function findGroupChat(userId, chatId) {
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      participants: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      messages: {
        include: {
          user: {
            select: {
              username: true,
              pfpurl: true,
            },
          },
        },
      },
    },
  });

  return chat;
}

export async function updatePfpUrl(userId, pfpurl) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      pfpurl,
    },
  });

  return true;
}

export async function updateChatPicUrl(userId, chatId, picUrl) {
  await prisma.chat.update({
    where: {
      id: chatId,
      participants: {
        some: {
          id: userId,
        },
      },
    },
    data: {
      chatPicUrl: picUrl,
    },
  });

  return true;
}

async function disconnectFriend() {
  const user = await prisma.user.update({
    where: {
      id: 8,
    },
    data: {
      friends: {
        disconnect: {
          id: 7,
        },
      },
    },
  });

  console.log(user);
}

async function deleteRequest() {
  const user = await prisma.friendRequest.delete({
    where: {
      user1Id_user2Id: {
        user1Id: 9,
        user2Id: 7,
      },
    },
  });

  console.log(user);
}

async function deleteChat() {
  await prisma.chat.delete({
    where: {
      id: 2,
    },
  });
}

async function deleteMsg() {
  await prisma.message.delete({
    where: {
      id: 1,
    },
  });
}
