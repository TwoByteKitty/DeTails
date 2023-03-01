import { Schema, model } from 'mongoose';

export interface IFeed {
  _id: string;
  feedDate: string;
  preyNo: number;
  preyType: Array<string>;
  dOD: string;
  mealWeight: number;
  eaten: string;
  feedComments: string;
  petId: string;
}

export const feedingSchema = new Schema<IFeed>(
  {
    feedDate: { type: String, required: true },
    preyNo: { type: Number, required: true },
    preyType: { type: [String], required: true },
    dOD: { type: String, required: true },
    mealWeight: { type: Number, required: true },
    eaten: { type: String, required: true },
    feedComments: { type: String, required: false },
    petId: { type: String, required: true },
  },
  { toJSON: { virtuals: true } }
);

export const Feeding = model<IFeed>('Feeding', feedingSchema);
