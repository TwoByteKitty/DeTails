import { Schema, model, Types } from 'mongoose';

export type PetType = 'cat' | 'dog' | 'reptile' | 'amphibian' | 'fish';
export type SexType = 'male' | 'female';

export interface IPet {
  _id: string;
  name: string;
  type: PetType;
  species: string;
  sex: SexType;
  dateOfBirth: Date;
  description: string;
}

const petSchema = new Schema<IPet>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  species: { type: String, required: true },
  sex: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  description: { type: String, required: true },
});

export const Pet = model<IPet>('Pet', petSchema);
