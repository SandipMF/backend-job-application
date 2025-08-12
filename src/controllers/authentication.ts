import { createUser, getUserByEmail } from "../db/users";
import express from "express";
import { authentication, random } from "../helpers";
import jwt from "jsonwebtoken";

const COOKIE_VARIABLE = process.env.COOKIE_VARIABLE;
const DOMAIN = "localhost";
const PATH = "/";

const JWT_SECRET = process.env.JWT_SECRET || "job-application-jwt-secret";
const JWT_EXPIRE_IN = "1d";

export const registerUser = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      console.log("Param missing");
      return response.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return response.sendStatus(400);
    }

    const salt = random();
    const newUser = await createUser({
      name,
      email,
      authentication: { salt, password: authentication(salt, password) },
    });

    return response.status(200).json(newUser).end();
  } catch (error) {
    console.log("Error in registerUser => ", error);
    return response.sendStatus(400);
  }
};

export const loginUser = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    // get request body params
    const { email, password } = request.body;

    // validate if any missing
    if (!email || !password) {
      console.log("Missing params");
      return response.sendStatus(400);
    }

    // get user by mail 1st
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    // Validate is there any user by that email
    if (!user) {
      return response.sendStatus(400);
    }

    // create the hash value by the given password and match
    const expectedHashValue = authentication(
      user.authentication.salt,
      password
    );
    if (expectedHashValue != user.authentication.password) {
      return response.sendStatus(400);
    }

    // creating new token and save
    // const salt = random();
    // user.authentication.sessionToken = authentication(
    //   salt,
    //   user._id.toString()
    // );

    // Token using JWT
    const jwToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_IN,
    });
    user.authentication.sessionToken = jwToken;

    await user.save();

    response.cookie(COOKIE_VARIABLE, user.authentication.sessionToken, {
      domain: DOMAIN,
      path: PATH,
      sameSite: "none",
      secure: false,
    });

    // return user
    return response.status(200).json(user).end();
  } catch (error) {
    console.log("loginUser error => ", error);
    return response.sendStatus(400);
  }
};
