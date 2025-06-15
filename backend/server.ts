import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

import userRoutes from "./users/user.route";
import questionRoutes from "./questions/question.route";
import { checkToken } from "./users/user.middleware";
import { routerNotFoundHandler, errorHandler } from "./utils/common";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI!;

mongoose.connect(MONGO_URI);

app.use(morgan("dev"));
app.use(cors());
app.use(json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/users", userRoutes);
app.use("/questions", checkToken, questionRoutes); // 🔐 Protected route

/* app.use(routerNotFoundHandler);
app.use(errorHandler); */

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
