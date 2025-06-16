import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB!;
const COLLECTION_NAME = process.env.MONGODB_COLLECTION!;

let db: Db;
let collection: Collection;

export async function connectToDatabase() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log("Connected to MongoDB Atlas");

  db = client.db(DB_NAME);
  collection = db.collection(COLLECTION_NAME);
}

export { db, collection };
