import { ErrorRequestHandler, RequestHandler } from "express";

export type Token = {
    _id: string,
    email: string,
    fullname: string;
};
export interface StandardResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
export class ErrorWithStatus extends Error {
    constructor(public message: string, public status: number) {
        super(message);
    }
}

export const routerNotFoundHandler: RequestHandler = (req, res, next) => {
    next(new ErrorWithStatus('Route not found', 404));
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof ErrorWithStatus) {
        res.status(error.status).json({ error: error.message });
    } else {
        res.status(500).json({ error: error.message });
    }
};

export interface Feedback {
  strengths: string[];
  weaknesses: string[];
}

export interface QAItem {
  question: string;
  answer: string;
  focus?: 'strength' | 'weakness' | 'general';
}