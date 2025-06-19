import { RequestHandler } from "express";
import { StandardResponse } from "../utils/common";
import { Job, JobModel } from "./job.model";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { InterviewQuestion, InterviewQuestionModel } from "../questions/question.model";

const openai = new OpenAI();
type ScanResult = {
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
};


export const scanResumeAndJD: RequestHandler<
  unknown,
  StandardResponse<ScanResult | null>,
  { jobDescription: string; resume: string },
  unknown
> = async (req, res, next) => {
  try {
    const { jobDescription, resume } = req.body;

    if (!jobDescription || !resume) {
      res.status(400).json({
        success: false,
        data: null,
        message: 'Job description and resume are required.',
      });
      return;
    }

    const prompt = `
You are a resume screening assistant. Based on the job description and the resume below, return a strict JSON object with the following format:

{
  "matchPercentage": number (from 0 to 100) please provide resume matching percentage between job description and resume,
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[]
}

Do NOT include any explanation. Only return the raw JSON object.

Job Description:
${jobDescription}

Resume:
${resume}
`;

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.1,
    });

    const raw = completion.choices[0].message.content ?? "";
    
    const cleaned = raw
      .replace(/^```[a-z]*\n?/i, '') 
      .replace(/```$/, '')           
      .trim();

    let parsed: ScanResult;

    try {
      parsed = JSON.parse(cleaned) as ScanResult;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      res.status(500).json({
        success: false,
        data: null,
        message: 'Failed to parse AI response.',
      });
      return;
    }
    console.log(parsed);
    res.json({
      success: true,
      data: {
        matchPercentage: parsed.matchPercentage || 0,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        suggestions: parsed.suggestions || []
      },
      message: 'Resume scan completed successfully.',
    });
  } catch (error) {
    console.error("Scan JD & Resume Error:", error);
    next(error);
  }
};


type questionsList = {  
  questions: {
    question: string;
    answer: string;
  }[];
};

export const generateQA: RequestHandler<
  unknown,
  StandardResponse<questionsList | null>,
  { jobDescription: string; resume: string },
  unknown
> = async (req, res, next) => {
  try {
    const { jobDescription, resume } = req.body;

    if (!jobDescription || !resume) {
      res.status(400).json({
        success: false,
        data: null,
        message: 'Job description and resume are required.',
      });
      return;
    }

    const prompt = `
You are a resume screening assistant.

Analyze the following job description and resume, then create a list of job-specific screening questions. For each question, generate a **positive and supportive answer**. If something is not clearly mentioned in the resume, assume the candidate is capable based on typical qualifications for the role, unless the resume clearly contradicts it.

Use this format as a pure JSON object only:

{
  "questions": [
    {
      "question": "Your question here?",
      "answer": "A positive answer inferred from resume content, or reasonably assumed if not directly stated."
    }
  ]
}

Job Description:
${jobDescription}

Resume:
${resume}
    `;

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.1,
    });

    const raw = completion.choices[0].message.content ?? "";    
   
    const cleaned = raw
      .replace(/^```[a-z]*\n?/i, '') 
      .replace(/```$/, '')           
      .trim();

    let parsed: questionsList;

    try {
      parsed = JSON.parse(cleaned) as questionsList;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      res.status(500).json({
        success: false,
        data: null,
        message: 'Failed to parse AI response.',
      });
      return;
    }  
    res.json({
      success: true,
      data:  {questions: parsed.questions} ,
      message: 'Resume scan completed successfully.',
    });
  } catch (error) {
    console.error("Scan JD & Resume Error:", error);
    next(error);
  }
};

export const saveQA: RequestHandler<unknown, StandardResponse<InterviewQuestion | null>, Partial<InterviewQuestion>> = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString();
    const userName = req.user?.fullname;    

    const filter = {
      'job.jobId': req.job?._id, 
      'user.userId': userId            
    };

    const update = {
      job: req.body.job,
      questions: req.body.questions,
      user: {
        userId,
        userName: userName ?? ''
      }
    };

    const result = await InterviewQuestionModel.findOneAndUpdate(
      filter,
      update,
      { new: true, upsert: true } 
    );

    res.json({ success: true, data: result });

  } catch (err: any) {
    console.error("Save QA Error:", err);
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

export const get_jobs: RequestHandler<unknown, StandardResponse<Job[]>, unknown, { page: string; }> = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const results = await JobModel.find({ "user.user_id": req.user?._id })
            .skip((page - 1) * 10).limit(10);        
        res.json({ success: true, data: results });
    } catch (err) {
        next(err);
    }
};
export const get_job: RequestHandler<{ job_id: string; }, StandardResponse<Job | null>> = async (req, res, next) => {
    try {
        const { job_id } = req.params;
        const results = await JobModel.findOne({ _id: job_id, "user.user_id": req.user?._id });
        res.json({ success: true, data: results });
    } catch (err) {
        next(err);
    }
};

export const post_job: RequestHandler<unknown, StandardResponse<Job>, Job> = async (req, res, next) => {
    try {             
        const results = await JobModel.create({
            ...req.body,
            user: {
        user_id: req.user?._id?.toString() ?? '',
        userName: req.user?.fullname ?? ''
      }
        });
        res.json({ success: true, data: results });
    } catch (err) {
        next(err);
    }
};

export const put_job: RequestHandler<{ job_id: string; }, StandardResponse<number>, Job> = async (req, res, next) => {
    try {
        const { job_id } = req.params;
        const results = await JobModel.updateOne(
            { _id: job_id, "user.user_id": req.user?._id },
            { $set: req.body }
        );
        res.status(200).json({ success: true, data: results.modifiedCount });
    } catch (err) {
        next(err);
    }
};

export const delete_job: RequestHandler<{ job_id: string; }, StandardResponse<number>> = async (req, res, next) => {
    try {
        const { job_id } = req.params;
        const results = await JobModel.deleteOne({ _id: job_id, "user.user_id": req.user?._id });
        res.status(200).json({ success: true, data: results.deletedCount });
    } catch (err) {
        next(err);
    }
};

