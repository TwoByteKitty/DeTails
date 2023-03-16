import { model, Schema } from 'mongoose';

export interface IUser {
  _id: string;
  userName: string;
  password: string;
  token: string;
}

const userSchema = new Schema<IUser>({
  userName: { type: String, required: true, trim: true },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: [(input: string) => input.length >= 4, 'Password should be four characters or longer'],
  },
  token: { type: String },
});

export const User = model<IUser>('User', userSchema);
