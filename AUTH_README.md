# Authentication System for Next.js

## API Endpoints

### Register a new user
**POST** `/api/auth/register`

Request body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response (201):
```json
{
  "id": "string",
  "username": "string"
}
```

### Login
**POST** `/api/auth/login`

Request body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response (200):
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string"
  }
}
```

### Logout
**POST** `/api/auth/logout`

Response (200):
```json
{
  "message": "Logged out successfully"
}
```

### Get current user (Protected)
**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "user": {
    "id": "string",
    "username": "string"
  }
}
```

## Protected Routes

The following routes require authentication:
- **POST** `/api/comments` - Create a comment
- **DELETE** `/api/comments?id=<commentId>` - Delete a comment

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Environment Variables

Add to your `.env` file:
```
JWT_SECRET=your_secure_secret_key_here
```
