import path from 'node:path';
import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import userRoutes from './users/users.router';
import jobRoutes from './jobs/job.route';
import { errorHandler, routerNotFoundHandler } from './utils/common';
import { checkToken } from './users/users.middleware';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import mongoose from 'mongoose';
dotenv.config();


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const MONGO_URI = process.env.MONGODB_URI!;
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:4200";

const app = express();

mongoose.connect(MONGO_URI);

app.use(morgan('dev'));
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(json());
app.use('/users', userRoutes);
app.use('/jobs', checkToken, jobRoutes);


app.use(routerNotFoundHandler);
app.use(errorHandler);
app.use(express.json({ limit: '20mb' })); 
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.listen(3000, () => console.log(`Listening on 3000`));
