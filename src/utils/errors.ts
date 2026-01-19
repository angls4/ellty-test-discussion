export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    console.log(new Error().stack);
    super(message);
  }
}

export const ErrorCodes = {
  // Auth errors
  INVALID_CREDENTIALS: { code: 401, message: "Invalid credentials" },
  USERNAME_EXISTS: { code: 409, message: "Username already exists" },
  NO_TOKEN: { code: 401, message: "No token provided" },
  INVALID_TOKEN: { code: 401, message: "Invalid or expired token" },
  UNAUTHORIZED: { code: 403, message: "Unauthorized" },
  
  // User errors
  USER_NOT_FOUND: { code: 404, message: "User not found" },
  MISSING_CREDENTIALS: { code: 400, message: "Username and password are required" },
  
  // Comment errors
  COMMENT_NOT_FOUND: { code: 404, message: "Comment not found" },
  PARENT_NOT_FOUND: { code: 404, message: "Parent comment not found" },
  MISSING_REQUIRED_FIELDS: { code: 400, message: "Missing required fields: authorId, value, operation" },
  COMMENT_ID_REQUIRED: { code: 400, message: "Comment ID is required" },
  INVALID_RESULT: { code: 400, message: "Operation resulted in an invalid value (Infinity or NaN)" },

  // Generic errors
  INTERNAL_SERVER_ERROR: { code: 500, message: "Internal server error" },
};
