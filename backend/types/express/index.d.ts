declare namespace Express {
    interface Request {
        user?: {
            _id: string,
            fullname: string;
        };
        job?: {
            _id: string,
            jobTitle: string;            
        };
        jobscan?:{
            jobDescription: string,
            resume: string;
        };
        matchData?:{            
            matchPercentage: number;
            strengths: string[];
            weaknesses: string[];
            suggestions: string[];            
        };
    }
    
}
