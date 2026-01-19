import { InsertOneResult, ObjectId } from "mongodb";
import { getCommentCollection } from "./model";
import { Comment, CreateCommentDTO } from "../../types/comment";

export class CommentRepository {
    async insertComment(data: Omit<Comment, "_id">): Promise<Comment> {
        const collection = await getCommentCollection();
        const result = await collection.insertOne(data as any);
        return {
            _id: result.insertedId,
            ...data,
        };
    }

    async getCommentById(id: string): Promise<Comment | null> {
        const collection = await getCommentCollection();
        return collection.findOne({ _id: new ObjectId(id), isDeleted: false });
    }

    async getCommentsByPath(path: string): Promise<Comment[]> {
        const collection = await getCommentCollection();
        return collection
            .aggregate([
            {
                $match: {
                    path: { $regex: `^${path}` },
                    isDeleted: false,
                },
            },
            {
                $addFields: {
                    parentIdAsObjectId: {
                        $cond: [
                            { $eq: [{ $type: "$parentId" }, "objectId"] },
                            "$parentId",
                            { $cond: [{ $ne: ["$parentId", null] }, { $toObjectId: "$parentId" }, null] }
                        ]
                    }
                },
            },
            {
                $lookup: {
                    from: "comments",
                    let: { parentId: "$parentIdAsObjectId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$parentId"] }, isDeleted: false } }
                    ],
                    as: "parentComment"
                }
            },
            {
                $addFields: {
                    parentResult: { $arrayElemAt: ["$parentComment.result", 0] }
                }
            },
            {
                $project: { parentComment: 0, parentIdAsObjectId: 0 }
            },
            {
                $addFields: {
                    depth: { $cond: [{ $eq: ["$path", ""] }, 0, { $size: { $split: ["$path", "/"] } }] },
                },
            },
            {
                $addFields: {
                    fullPath: {
                        $cond: [
                            { $eq: ["$path", ""] },
                            { $toString: "$_id" },
                            { $concat: ["$path", "/", { $toString: "$_id" }] }
                        ]
                    }
                }
            },
            {
                $sort: { fullPath: 1, createdAt: 1 },
            },
            ])
            .toArray() as unknown as Comment[];
    }

    async getAllComments(): Promise<Comment[]> {
        const collection = await getCommentCollection();
        return collection
            .aggregate([
                {
                    $match: {
                    isDeleted: false,
                    },
                },
                {
                    $addFields: {
                        parentIdAsObjectId: {
                            $cond: [
                                { $eq: [{ $type: "$parentId" }, "objectId"] },
                                "$parentId",
                                { $cond: [{ $ne: ["$parentId", null] }, { $toObjectId: "$parentId" }, null] }
                            ]
                        }
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        let: { parentId: "$parentIdAsObjectId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$parentId"] }, isDeleted: false } }
                        ],
                        as: "parentComment"
                    }
                },
                {
                    $addFields: {
                        parentResult: { $arrayElemAt: ["$parentComment.result", 0] }
                    }
                },
                {
                    $project: { parentComment: 0, parentIdAsObjectId: 0 }
                },
                {
                    $addFields: {
                    depth: { $cond: [{ $eq: ["$path", ""] }, 0, { $size: { $split: ["$path", "/"] } }] },
                    },
                },
                {
                    $addFields: {
                        fullPath: {
                            $cond: [
                                { $eq: ["$path", ""] },
                                { $toString: "$_id" },
                                { $concat: ["$path", "/", { $toString: "$_id" }] }
                            ]
                        }
                    }
                },
                {
                    $sort: { fullPath: 1, createdAt: 1 },
                },
            ])
            .toArray() as unknown as Comment[];
    }

    async deleteComment(id: string): Promise<boolean> {
        const collection = await getCommentCollection();
        const result = await collection.updateOne(
        { _id: new ObjectId(id), isDeleted: false },
        {
            $set: {
            isDeleted: true,
            updatedAt: new Date(),
            },
        }
        );
        return result.modifiedCount > 0;
    }
}

export const commentRepository = new CommentRepository();

