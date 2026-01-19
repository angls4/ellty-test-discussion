import { ObjectId } from "mongodb";

export interface User {
    _id: ObjectId;
    username: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDTO {
    username: User["username"];
    password: User["passwordHash"];
}