import { Schema, model, InferSchemaType, pluralize } from "mongoose";

pluralize(null); // Disable pluralization of collection name

const InterviewQuestionSchema = new Schema(
  {
    user: {
      userId: { type: Schema.Types.ObjectId },
      userName: String,
    },
    job: {
      jobId: { type: Schema.Types.ObjectId },
      jobTitle: String,
    },
    questions: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  { timestamps: true }
);

// Create TypeScript type for type safety
export type Question = {
  user: {
    userId: string;
    userName: string;
  };
  job: {
    jobId: string;
    jobTitle: string;
  };
  questions: {
    question: string;
    answer: string;
  }[];
};

// Create the Mongoose model
export const QuestionModel = model<Question>(
  "question",
  InterviewQuestionSchema
);
