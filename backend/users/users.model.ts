import { Schema, model, InferSchemaType, pluralize } from 'mongoose';

pluralize(null);

const userSchema = new Schema({
    fullname: String,
    email: { type: String, unique: true },
    password: String,
    
});

export type User = {
    fullname: string,
    email: string,
    password: string,
    
};

export const UserModel = model<User>('user', userSchema);