import mongoose, { QueryOptions } from "mongoose";

// Application schema
const JobApplicationSchema = new mongoose.Schema({
  company: { type: String, require: true },
  role: { type: String, require: true },
  jobType: { type: String, require: true },
  location: { type: String, require: false },
  date: { type: String, require: true },
  status: { type: String, require: true },
  note: { type: String, require: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
});

// Application Model
export const JobApplicationModel = mongoose.model(
  "JobApplication",
  JobApplicationSchema
);

// for CREATE operation to db
export const createApplication = (
  values: Record<string, unknown>,
  userId: mongoose.Types.ObjectId
) =>
  new JobApplicationModel({ ...values, userId })
    .save()
    .then((application) => application.toObject());

// For FETCH operation from db
export const getApplications = (userId: mongoose.Types.ObjectId) =>
  JobApplicationModel.find({ userId });

// For FETCH operation by id from db
export const getApplicationById = (id: string) =>
  JobApplicationModel.findById(id);

// For UPDATE operation by id from db
export const updateApplicationById = (
  id: string,
  values: Record<string, unknown>,
  options: QueryOptions = { new: true, runValidators: true }
) => JobApplicationModel.findByIdAndUpdate(id, values, options);

// For DELETE operation by id from db
export const deleteApplicationById = (id: string) =>
  JobApplicationModel.findByIdAndDelete(id);
