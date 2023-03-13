import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';

export interface IUser {
  _id: string;
  userName: string;
  password: string;
  comparePassword: (challenge: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  userName: { type: String, required: true, trim: true },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: [(input: string) => input.length >= 4, 'Password should be four characters or longer'],
  },
});

class NewUser implements IUser {
  constructor({ _id, userName, password }: { _id: string; userName: string; password: string }) {
    this._id = _id;
    this.userName = userName;
    this.password = password;
  }
  _id: string;
  userName: string;
  password: string;
  comparePassword(challenge: string) {
    return bcrypt.compare(challenge, this.password);
  }
}

userSchema.loadClass(NewUser);

export const User = model<IUser>('User', userSchema);
