import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {
  getUserData,
  initiateFriendRequest,
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
app.post("/user/addFriendRequest", initiateFriendRequest);

app.get("/user", getUserData);

app.listen(3000);
