import { ObjectId } from "mongodb";
import { commentRepository } from "./repository";
import { CreateCommentDTO, Comment } from "../../types/comment";
import { UserRepository } from "../user/repository";
import { AppError, ErrorCodes } from "../../utils/errors";

export class CommentService {
    private userRepository = new UserRepository();

    private calculateResult(
        operation: Comment["operation"],
        parentResult: Comment["result"],
        value: number
    ): number {
        switch (operation) {
            case "add":
                return parentResult + value;
            case "subtract":
                return parentResult - value;
            case "multiply":
                return parentResult * value;
            case "divide":
                return parentResult / value;
            default:
                throw new AppError("Invalid operation", 400);
        }
    }

    async createComment(dto: CreateCommentDTO): Promise<Comment> {
        // Validate required fields
        if (!dto.authorId || dto.value === undefined || dto.value === null || !dto.operation) {
            throw new AppError(ErrorCodes.MISSING_REQUIRED_FIELDS.message, ErrorCodes.MISSING_REQUIRED_FIELDS.code);
        }

        // Check if user exists
        const user = await this.userRepository.getUserById(dto.authorId.toString());
        if (!user) {
            throw new AppError(ErrorCodes.USER_NOT_FOUND.message, ErrorCodes.USER_NOT_FOUND.code);
        }

        let path: Comment["path"];
        let result: Comment["result"];

        if (dto.parentId) {
            // Reply to existing comment
            const parent = await commentRepository.getCommentById(dto.parentId.toString());
            if (!parent) {
                throw new AppError(ErrorCodes.PARENT_NOT_FOUND.message, ErrorCodes.PARENT_NOT_FOUND.code);
            }
            // path = parent's path + parent's id
            path = `${parent.path ? `${parent.path}/` : ""}${parent._id.toHexString()}`;
            // result = apply operation on parent's result with request's value
            const calculatedResult = this.calculateResult(dto.operation, parent.result, dto.value as number);
            
            // Validate result is not Infinity or NaN
            if (!isFinite(calculatedResult)) {
                throw new AppError(ErrorCodes.INVALID_RESULT.message, ErrorCodes.INVALID_RESULT.code);
            }
            
            result = calculatedResult;
        } else {
            // Root comment
            path = "";
            result = dto.value as number;
        }

        const comment: Omit<Comment, "_id"> = {
            authorId: user._id,
            authorUsername: user.username,
            parentId: dto.parentId,
            path,
            value: dto.value,
            operation: dto.operation,
            result,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return commentRepository.insertComment(comment);
    }

    async getComments(): Promise<Comment[]> {
        return commentRepository.getAllComments();
    }

}

export const commentService = new CommentService();
