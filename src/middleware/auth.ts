import { NextRequest } from 'next/server';
import { userService } from '@/models/user/service';
import jwt from 'jsonwebtoken';
import config from '@/config/env';
import { AppError, ErrorCodes } from '@/utils/errors';
import { UserRepository } from '@/models/user/repository';

const JWT_SECRET = config.JWT_SECRET;
const userRepository = new UserRepository();

export async function authenticate(req: NextRequest) {
    // Try to get token from Authorization header first
    let token = null;
    const authHeader = req.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        // Fall back to cookie
        token = req.cookies.get('auth_token')?.value;
    }
    
    if (!token) {
        return { error: 'No token provided', status: 401 };
    }
    
    try {
        const decoded = verifyToken(token);
        const user = await userRepository.getUserById(decoded.id);
        return { user: user, status: 200 };
    } catch (error) {
        return { error: 'Invalid or expired token', status: 401 };
    }
}

function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    } catch (error) {
        throw new AppError(ErrorCodes.INVALID_TOKEN.message, ErrorCodes.INVALID_TOKEN.code);
    }
}
