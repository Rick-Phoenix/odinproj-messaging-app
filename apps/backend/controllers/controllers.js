import { body, validationResult } from "express-validator";
import { checkPassword, genPassword } from "../auth/passwordUtils.js";
import jwt from "jsonwebtoken";
import {
  addAcceptedFriendRequest,
  addGroupChat,
  addMessage,
  addMessageWithPic,
  addOrEditProfile,
  createFriendRequest,
  createUser,
  fetchProfile,
  fetchUserData,
  findGroupChat,
  findOrCreateChat,
  getUserByUsername,
  isEmailTaken,
  isUsernameTaken,
  setRejectedFriendRequest,
  updateChatPicUrl,
  updatePfpUrl,
} from "../prisma/queries.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const secretKey = process.env.JWT_SECRET;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    asset_folder: "Messaging App",
    public_id: async (req, file) => `${req.body.username}`,
    overwrite: true,
    unique_filename: false,
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const msgImageUploadChain = [
  upload.single("image"),
  async (req, res) => {
    const upload = await addMessageWithPic(
      req.user.userId,
      +req.params.chatId,
      req.file.path
    );
    if (!upload) return res.status(400).json("An error occurred.");
    res.json("Upload successful.");
  },
];

export const pfpUploadChain = [
  upload.single("pfp"),
  async (req, res, next) => {
    if (!req?.file) return next();
    const newPfpUrl = await updatePfpUrl(req.user.userId, req.file.path);
    if (!newPfpUrl)
      return res
        .status(400)
        .json("An error occurred while uploading the picture.");
    next();
  },
];

export const chatPicUploadChain = [
  upload.single("chatPic"),
  async (req, res) => {
    const newChatPicUrl = await updateChatPicUrl(
      req.user.userId,
      +req.body.chatId,
      req.file.path
    );

    if (!newChatPicUrl)
      return res
        .status(400)
        .json("An error occurred while uploading the picture.");
    return res.json("Upload successful.");
  },
];

export const signUpValidationChain = [
  body("username")
    .trim()
    .custom((value) => {
      const forbiddenChars = /[<>&'"/\\`]/;
      if (forbiddenChars.test(value)) {
        throw new Error(
          "Username cannot contain characters like <, >, &, \\, /, `, ', \""
        );
      }
      return true;
    })
    .escape()
    .isLength({ min: 4, max: 24 })
    .withMessage("Username must be between 4 and 24 characters.")
    .custom(async (username) => {
      const isTaken = await isUsernameTaken(username);
      if (isTaken) throw new Error("This username is already taken.");
      else return true;
    }),
  body("email")
    .trim()
    .custom((value) => {
      const forbiddenChars = /[<>&'"/\\`]/;
      if (forbiddenChars.test(value)) {
        throw new Error(
          "Email cannot contain characters like <, >, &, \\, /, `, ', \""
        );
      }
      return true;
    })
    .escape()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(async (email) => {
      const isTaken = await isEmailTaken(email);
      if (isTaken) throw new Error("This email is already registered.");
      else return true;
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number."),
  body("passconfirm").custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error("The passwords do not match.");
    else return true;
  }),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { username, email, password } = req.body;
    const { hash, salt } = genPassword(password);
    createUser(username, email, hash, salt);
    res.status(200).json({ success: true });
  },
];

export async function validateLogin(req, res) {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if (!user) return res.status(400).json("This user does not exist.");
  const { hash, salt } = user;
  const pwCheck = checkPassword(password, hash, salt);
  if (!pwCheck) return res.status(400).json("Incorrect password.");
  jwt.sign(
    { userId: user.id, username },
    secretKey,
    { expiresIn: "2h" },
    (err, token) => {
      res.json({
        token,
      });
    }
  );
}

export function validateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    req.user = decodedToken;
    next();
  });
}

export async function getUserData(req, res) {
  const userData = await fetchUserData(req.user.userId);

  res.json(userData);
}

export async function initiateFriendRequest(req, res) {
  const friendRequest = await createFriendRequest(
    req.user.userId,
    req.body.email
  );
  if (friendRequest?.error) return res.status(400).json(friendRequest.error);
  return res.json("Request sent.");
}

export async function acceptFriendRequest(req, res) {
  const acceptedRequest = await addAcceptedFriendRequest(
    req.user.userId,
    +req.body.friendId
  );
  if (acceptedRequest) return res.json("Request accepted.");
}

export async function rejectFriendRequest(req, res) {
  const rejectedRequest = await setRejectedFriendRequest(
    req.user.userId,
    +req.body.friendId
  );

  if (rejectedRequest) return res.json("Friend request rejected correctly.");
}

export async function getProfile(req, res) {
  const profile = await fetchProfile(req.params.username);

  if (profile === false) return res.status(400).json("No profile found.");
  if (profile === null)
    return res.status(400).json("This user does not have a profile yet.");
  else res.json(profile);
}

export async function createOrEditProfile(req, res) {
  const { name, status, bio } = req.body;
  const profile = await addOrEditProfile(req.user.userId, name, status, bio);

  if (!profile) return res.status(400);
  else res.json("Profile updated successfully.");
}

export async function getChat(req, res) {
  const chat = await findOrCreateChat(
    req.user.userId,
    req.params.contactUsername
  );

  res.json(chat);
}

export async function newMessage(req, res) {
  await addMessage(req.user.userId, +req.body.chatId, req.body.message);

  res.json("Message added.");
}

export async function newGroupChat(req, res) {
  const { name, participants } = req.body;
  const newChatId = await addGroupChat(req.user.userId, name, participants);

  if (!newChatId)
    return res
      .status(400)
      .json("An error occurred in the creation of the chat.");
  res.json(newChatId);
}

export async function getGroupChat(req, res) {
  const chat = await findGroupChat(req.user.userId, +req.params.chatId);

  if (!chat) return res.status(400).json("Chat not found.");
  res.json(chat);
}
