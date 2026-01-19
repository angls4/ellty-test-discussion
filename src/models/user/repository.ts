import { User } from '@/types/user';
import { ObjectId } from 'mongodb';
import { getUserCollection } from './model';

export class UserRepository {
    async insertUser(data: Omit<User, "_id">): Promise<User> {
        const collection = await getUserCollection();
        const result = await collection.insertOne(data as any);
        return {
            _id: result.insertedId,
            ...data,
        };
    }

    async getUserById(id: string): Promise<User | null> {
        const collection = await getUserCollection();
        return collection.findOne({ _id: new ObjectId(id) });
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const collection = await getUserCollection();
        return collection.findOne({ username });
    }
}