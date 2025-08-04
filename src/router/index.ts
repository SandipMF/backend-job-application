import express from "express";
import job_application from "./job_application";

const router = express.Router();
export default (): express.Router => {
  job_application(router);
  return router;
};
