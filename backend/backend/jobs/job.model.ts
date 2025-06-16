import { Schema, model, InferSchemaType, pluralize } from "mongoose";

pluralize(null);

const JobSchema = new Schema(
  {
    user: {
      user_id: { type: Schema.Types.ObjectId },
      userName: String,
    },
    company: String,
    jobTitle: String,
    jobDescription: String,
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Accepted", "Rejected"],
      default: "Applied",
    },
    salary: Number,
    application_Date: { type: Date, default: Date.now },
    location: String,
    notes: String,
    resume: {
      fileName: String,
      resumeContent: String,
      file_Url: String,
    },
  },
  { timestamps: true }
);

export type Job = {
  user: {
    user_id: String;
    userName: String;
  };
  company: String;
  jobTitle: String;
  jobDescription: String;
  status: String;
  salary: Number;
  application_Date: Date;
  location: String;
  notes: String;
  resume: {
    fileName: String;
    resumeContent: String;
    file_Url: String;
  };
};

export const JobModel = model<Job>("job", JobSchema);
