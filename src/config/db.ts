import { MongoClient, Db } from "mongodb";
import config from "./env";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB() {
    try {
        client = new MongoClient(config.MONGO_URI);
        await client.connect();
        db = client.db(config.DB_NAME);
        console.log("Connected to database");
    } catch (error) {
        console.error("Failed to connect to database:", error);
        throw error;
    }
}

export async function getDB(): Promise<Db> {
    if (!db) {
        await connectDB();
    }
    return db!;
}

export async function disconnectDB() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log("Database disconnected.");
    }
}
