import { Schema, model } from 'mongoose';
import moment from 'moment';
// Same comments as shed.ts
export interface IFeeding {
  _id: string;
  feedDate: Date;
  preyNo: number;
  preyType: string;
  dOD: string;
  mealWeight: number;
  eaten: boolean;
  feedComments: string;
}

const feedingSchema = new Schema<IFeeding>(
  {
    feedDate: { type: Date, required: true },
    preyNo: { type: Number, required: true },
    preyType: { type: String, required: true },
    dOD: { type: String, required: true },
    mealWeight: { type: Number, required: true },
    eaten: { type: Boolean, required: true },
    feedComments: { type: String, required: false },
  },
  { toJSON: { virtuals: true } }
);

export const Feeding = model<IFeeding>('Pet', feedingSchema);
