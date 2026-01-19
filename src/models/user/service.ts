import { UserRepository } from './repository';
import { CreateUserDTO } from '../../types/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/env';
import { AppError, ErrorCodes } from '../../utils/errors';

const userRepository = new UserRepository();
const JWT_SECRET = config.JWT_SECRET;

export class UserService {
    async register(data: CreateUserDTO) {
        // Validate input
        if (!data.username || !data.password) {
            throw new AppError(ErrorCodes.MISSING_CREDENTIALS.message, ErrorCodes.MISSING_CREDENTIALS.code);
        }
        
        const existingUser = await userRepository.getUserByUsername(data.username);
        if (existingUser) {
            throw new AppError(ErrorCodes.USERNAME_EXISTS.message, ErrorCodes.USERNAME_EXISTS.code);
        }
        
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await userRepository.insertUser({ 
            username: data.username, 
            passwordHash: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        return { 
            id: user._id.toString(), 
            username: user.username 
        };
    }

    async login(username: string, password: string) {
        // Validate input
        if (!username || !password) {
            throw new AppError(ErrorCodes.MISSING_CREDENTIALS.message, ErrorCodes.MISSING_CREDENTIALS.code);
        }
        
        const user = await userRepository.getUserByUsername(username);
        if (!user) {
            throw new AppError(ErrorCodes.INVALID_CREDENTIALS.message, ErrorCodes.INVALID_CREDENTIALS.code);
        }
        
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new AppError(ErrorCodes.INVALID_CREDENTIALS.message, ErrorCodes.INVALID_CREDENTIALS.code);
        }
        
        const token = jwt.sign(
            { id: user._id.toString(), username: user.username }, 
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        return { 
            token,
            user: {
                id: user._id.toString(),
                username: user.username
            }
        };
    }
}

export const userService = new UserService();
