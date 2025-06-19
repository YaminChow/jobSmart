import { model, pluralize, Schema } from "mongoose";

pluralize(null);

const InterviewQuestionSchema = new Schema({
  user: {
    userId: { type: Schema.Types.ObjectId, required: true },
    userName: { type: String }
  },

  job: {
    jobId: { type: Schema.Types.ObjectId, required: true },
    jobTitle: { type: String }
  },

  questions: [
    {
      question: { type: String, required: true },
      answer: { type: String }, 
            
    }
  ]
}, { timestamps: true });

export type InterviewQuestion = {
    user: {
        userId: String,
        userName:String
    },
    job: {
    jobId: String,
    jobTitle: String
  },
    questions: [
    {
      question: String,
      answer: String,       
    }
  ]


};

export const InterviewQuestionModel = model<InterviewQuestion>('interviewQuestion', InterviewQuestionSchema);