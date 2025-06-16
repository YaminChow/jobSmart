declare namespace Express {
  interface Request {
    user?: {
      _id: string;
      fullname: string;
    };
  }
  interface Request {
    job?: {
      _id: string;
      jobTitle: string;
    };
  }
}
