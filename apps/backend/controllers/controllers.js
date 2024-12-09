import { body, validationResult } from "express-validator";
import { checkPassword, genPassword } from "../auth/passwordUtils.js";
import jwt from "jsonwebtoken";
import {
  createFriendRequest,
  createUser,
  fetchUserData,
  getUserByUsername,
  isEmailTaken,
  isUsernameTaken,
} from "../prisma/queries.js";
const secretKey = process.env.JWT_SECRET;

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
