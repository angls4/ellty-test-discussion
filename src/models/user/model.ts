import { getDB } from "../../config/db";
import { Collection } from "mongodb";
import { User } from "@/types/user";

export async function getUserCollection(): Promise<Collection<User>> {
    const db = await getDB();
    return db.collection<User>("users");
}

