import fs from 'fs/promises';
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import OpenAI from 'openai';

import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const MONGO_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB!;
const COLLECTION_NAME = process.env.MONGODB_COLLECTION!;

const client = new MongoClient(MONGO_URI);
// const client = new MongoClient(MONGO_URI, {
//   tls: true,
//   minTLSVersion: 'TLSv1.2', // Enforce TLS 1.2 or higher
// });
const rl = readline.createInterface({ input, output });

async function generateEmbeddingsAndSave() {
  const raw = await fs.readFile('./questions.json', 'utf-8');
  const movies = JSON.parse(raw);

  const collection = client.db(DB_NAME).collection(COLLECTION_NAME);

  for (const movie of movies) {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: movie.jobTitle,
    });

    const embedding = response.data[0].embedding;

    await collection.insertOne({
      jobTitle: movie.jobTitle,
      questions: movie.questions,
      embedding,
    });

    console.log(`Inserted: ${movie.jobTitle}`);
  }
}

async function semanticSearch(query: string, topK = 5) {
  const vector = (
    await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    })
  ).data[0].embedding;

  const Model = client.db(DB_NAME).collection(COLLECTION_NAME);

  const results = await Model
    .aggregate([
      {
        $vectorSearch: {
          queryVector: vector,
          path: 'embedding',
          numCandidates: 20,
          limit: 5,
          index: 'vector_index', 
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ])
    .toArray();

  console.log('\n Search Results:');
  for (const r of results) {
    console.log(`\n ${r.jobTitle}\n ${r.questions}\n⭐ Score: ${r.score.toFixed(4)}`);
  }
}

async function main() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const answer = await rl.question('Type "init" to upload movies or enter a search query: ');
    if (answer.trim().toLowerCase() === 'init') {
      await generateEmbeddingsAndSave();
      console.log('✅ Embeddings generated and saved.');
    } else {
      await semanticSearch(answer);
    }

    rl.close();
    await client.close();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();
