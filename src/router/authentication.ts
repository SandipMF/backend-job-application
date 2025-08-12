import { loginUser, registerUser } from "../controllers/authentication";
import express from "express";

export default (route: express.Router) => {
  route.post("/auth/login", loginUser);
  route.post("/auth/register", registerUser);
};
