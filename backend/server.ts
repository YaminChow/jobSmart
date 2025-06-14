import path from 'node:path';
import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
 
import userRoutes from './users/user.route';
import { errorHandler, routerNotFoundHandler } from './utils/common';
 
import { checkToken } from './users/user.middleware';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
dotenv.config();
 
 
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
 
const MONGO_URI = process.env.MONGODB_URI!;
 
const app = express();
 
mongoose.connect(MONGO_URI);
 
app.use(morgan('dev'));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(json());
app.use('/users', userRoutes);
//app.use('/diaries', checkToken, diaryRoutes);
 
app.use(routerNotFoundHandler);
app.use(errorHandler);
 
app.listen(3000, () => console.log(`Listening on 3000`));
 