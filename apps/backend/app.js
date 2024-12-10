import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {
  acceptFriendRequest,
  createOrEditProfile,
  getChat,
  getProfile,
  getUserData,
  initiateFriendRequest,
  newMessage,
  rejectFriendRequest,
  signUpValidationChain,
  validateLogin,
  validateToken,
} from "./controllers/controllers.js";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
  })
);

app.use("/user", validateToken);

app.post("/signup", signUpValidationChain);
app.post("/login", validateLogin);
app.post("/user/friendRequest/new", initiateFriendRequest);
app.post("/user/friendRequest/accept", acceptFriendRequest);
app.post("/user/profile", createOrEditProfile);
app.post("/user/chats/:contactUsername", newMessage);

app.put("/user/friendRequest/reject", rejectFriendRequest);
app.put("/user/profile", createOrEditProfile);

app.get("/user", getUserData);
app.get("/user/profiles/:username", getProfile);
app.get("/user/chats/:contactUsername", getChat);

app.listen(3000);
