export type User = {
  fullname: string,
  email: string,
  password: string,
  picture_url?: string;
};

export type Token = {
  _id: string,
  email: string,
  fullname: string;
};

export const Initial_State: Token = {
  _id: '',
  email: '',
  fullname: ''
};


export type Job = {
  _id: string;
  jobTitle: string;
  jobDescription:string;
  jobURL: string,
  company: string;
  location: string;
  status: string;
  application_Date: Date; 
  feedback:matchJobData; 
  
};

export type ScanRequest = {
  jobDescription: string;
  resume: string;
};




export type matchJobData = {            
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];            
};

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  message?: String;
}

export interface QAItem {
  question: String;
  answer: String;
}

export type InterviewQuestion = {
    user: {
        userId: String,
        userName:String
    },
    job: {
    jobId: String,
    jobTitle: String
  },
    questions: QAItem[]
};

export interface QAResponse {
  jobTitle: string;
  questions: QAItem[];
}


