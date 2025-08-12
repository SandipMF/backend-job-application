import express from "express";
import job_application from "./job_application";
import authentication from "./authentication";

const router = express.Router();
export default (): express.Router => {
  job_application(router);
  authentication(router);
  return router;
};
