import { RequestHandler } from "express";
import { StandardResponse } from "../utils/common";
import { Question, QuestionModel } from "./question.model";
import mongoose from "mongoose";

export const get_question: RequestHandler<
  { job_id: string },
  StandardResponse<Question | null>
> = async (req, res, next) => {
  try {
    const { job_id } = req.params;

    const results = await QuestionModel.findOne({
      "job.jobId": job_id,
      "user.userId": req.user?._id,
    });

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};
