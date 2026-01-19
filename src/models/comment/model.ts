import { getDB } from "../../config/db";
import { Collection } from "mongodb";
import { Comment } from "../../types/comment";

export async function getCommentCollection(): Promise<Collection<Comment>> {
    const db = await getDB();
    return db.collection<Comment>("comments");
}