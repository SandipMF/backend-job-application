import express from "express";
import mongoose from "mongoose";
import {
  createApplication,
  deleteApplicationById,
  getApplicationById,
  getApplications,
  updateApplicationById,
} from "../db/applications";
import { getUserBySessionToken } from "../db/users";
import jwt from "jsonwebtoken";

const COOKIE_VARIABLE = process.env.COOKIE_VARIABLE;
const JWT_SECRET = process.env.JWT_SECRET || "job-application-jwt-secret";

// for creating new application
export const createNewJobApplication = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { company, role, jobType, location, date, status, note } =
      request.body;

    // validate all the request bady paras
    if (
      !company ||
      !role ||
      !jobType ||
      (jobType === "Onsite" && !location) ||
      !date ||
      !status
    ) {
      return response.sendStatus(403);
    }

    // get user by cookies
    let userId;
    const sessionToken = request.cookies[COOKIE_VARIABLE];
    jwt.verify(
      sessionToken,
      JWT_SECRET,
      (error: Error, user: { id: string; mail: string }) => {
        if (error) {
          return response.sendStatus(401).json({ message: "Unauthorized" });
        } else {
          userId = user.id;
        }
      }
    );
    // const user = await getUserBySessionToken(sessionToken);
    // if (!user) {
    //   return response.sendStatus(401).json({ message: "Unauthorized" }); //401 Unauthorized
    // }

    // create new application
    const newApplication = await createApplication(
      {
        company,
        role,
        jobType,
        location,
        date,
        status,
        note,
      },
      userId as mongoose.Types.ObjectId
    );

    return response.status(200).json(newApplication).end();
  } catch (error) {
    return response.sendStatus(400);
  }
};

// to fetch the individual application based on id
export const fetchJobApplicationById = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { id } = request.params;
    const user = await getApplicationById(id);
    return response.status(200).json(user).end();
  } catch (error) {
    return response.sendStatus(400);
  }
};

// To get all added applications
export const fetchAllApplication = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    // get user by cookies
    let userId;
    const sessionToken = request.cookies[COOKIE_VARIABLE];
    jwt.verify(
      sessionToken,
      JWT_SECRET,
      (error: Error, user: { id: string; mail: string }) => {
        if (error) {
          return response.sendStatus(401).json({ message: "Unauthorized" });
        } else {
          userId = user.id;
        }
      }
    );
    // get user by cookies
    // const user = await getUserBySessionToken(sessionToken);
    // if (!user) {
    //   return response.sendStatus(401).json({ message: "Unauthorized" }); //401 Unauthorized
    // }
    const applications = await getApplications(
      userId as mongoose.Types.ObjectId
    );
    return response.status(200).json(applications).end();
  } catch (error) {
    return response.sendStatus(400);
  }
};

// For deleting the applicatition based on id
export const deleteJobApplication = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { id } = request.params;

    // get the application to validate its exist or not
    const isApplicationExist = await getApplicationById(id);
    if (!isApplicationExist) {
      return response.sendStatus(400);
    }

    // perform delete
    const deletedUser = await deleteApplicationById(id);

    return response.status(200).json(deletedUser).end();
  } catch (error) {
    return response.sendStatus(400);
  }
};

// For update application data
export const updateApplicationData = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { id } = request.params;
    const { company, role, jobType, location, date, status, note } =
      request.body;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return response.sendStatus(400);
    }

    // Validate all params in body request
    if (
      !company ||
      !role ||
      !jobType ||
      (jobType === "Onsite" && !location) ||
      !date ||
      !status
    ) {
      return response.sendStatus(403);
    }

    // Update data
    const updateApplication = await updateApplicationById(id, {
      company,
      role,
      jobType,
      location,
      date,
      status,
      note,
    });
    return response.status(200).json(updateApplication).end();
  } catch (error) {
    return;
  }
};
