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
  applicationDate: Date; 
  feedback:{
    matchPercentage: Number;
  } 
  
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

