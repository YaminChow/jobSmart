import path from "node:path";
import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "node:fs/promises";

import { MongoClient } from "mongodb";
import { config } from "dotenv";
/* import { connectToDatabase, collection } from "./db.ts"; */
import userRoutes from "./users/user.route.ts";

import OpenAI from "openai";
import readline from "node:readline";

config();
const app = express();
const MONGO_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB!;
const COLLECTION_NAME = process.env.MONGODB_COLLECTION!;
const client = new MongoClient(MONGO_URI);
const collection = client.db(DB_NAME).collection(COLLECTION_NAME);
const PORT = process.env.PORT || 3000;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

app.use(morgan("dev"));
app.use(cors());

app.use(json());
// Example test route
app.get("/", async (req, res) => {
  const count = await collection.countDocuments();
  res.json({ message: "Server is working!", totalDocuments: count });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/users", userRoutes);

/* async function generateEmbeddingsAndSave() {
  const raw = await fs.readFile("./question.json", "utf-8");
  const qus = JSON.parse(raw);

  const collection = client.db(DB_NAME).collection(COLLECTION_NAME);

  for (const q of qus) {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: q.jobTitle,
    });

    const embedding = response.data[0].embedding;

    await collection.insertOne({
      name: q.jobTitle,
      description: q.questions,
      embedding,
    });

    console.log(`Inserted: ${q.jobTitle}`);
  }
}

async function semanticSearch(query: string, topK = 5) {
  const vector = (
    await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    })
  ).data[0].embedding;

  const Model = client.db(DB_NAME).collection(COLLECTION_NAME);

  const results = await Model.aggregate([
    {
      $vectorSearch: {
        queryVector: vector,
        path: "embedding",
        numCandidates: 20,
        limit: 5,
        index: "vector_index",
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]).toArray();

  console.log("\n Search Results:");
  for (const r of results) {
    console.log(
      `\n ${r.name}\n ${r.description}\n⭐ Score: ${r.score.toFixed(4)}`
    );
  }
}

async function main() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    const answer = await rl.question(
      'Type "init" to upload movies or enter a search query: '
    );
    if (answer.trim().toLowerCase() === "init") {
      await generateEmbeddingsAndSave();
      console.log("✅ Embeddings generated and saved.");
    } else {
      await semanticSearch(answer);
    }

    rl.close();
    await client.close();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main(); */

/* async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
  }
}

startServer(); */


/* import userRoutes from './users/users.router';
import diaryRoutes from './diaries/diary.router';
import { errorHandler, routerNotFoundHandler } from './utils/common';

import { checkToken } from './users/users.middleware'; */

/* app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); */
/*app.use('/users', userRoutes);
app.use('/diaries', checkToken, diaryRoutes); */

/* app.use(routerNotFoundHandler);
app.use(errorHandler); */
