import { ObjectId } from "mongodb";
import { User } from "./user";

export type CommentOperation = "add" | "subtract" | "divide" | "multiply";

export interface Comment {
    _id: ObjectId;
    authorId: User["_id"];
    authorUsername: User["username"];
    parentId?: ObjectId;
    path: string;
    value?: number;
    operation?: CommentOperation;
    result: number;
    parentResult?: number;
    depth?: number;
    fullPath?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCommentDTO {
    authorId: User["_id"];
    authorUsername: User["username"];
    parentId?: Comment["parentId"];
    value: Comment["value"];
    operation: Comment["operation"];
    result: Comment["result"];
}