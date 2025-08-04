import express from "express";
import {
  createNewJobApplication,
  deleteJobApplication,
  fetchAllApplication,
  fetchJobApplicationById,
  updateApplicationData,
} from "../controllers/job_applications";

export default (router: express.Router) => {
  router.post("/applications", createNewJobApplication);
  router.get("/applications", fetchAllApplication);
  router.get("/applications/:id", fetchJobApplicationById);
  router.delete("/applications/:id", deleteJobApplication);
  router.patch("/applications/:id", updateApplicationData);
};
