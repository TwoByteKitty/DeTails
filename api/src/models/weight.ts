import { Schema, model } from 'mongoose';
import moment from 'moment';
// Same comments as shed.ts
export interface IWeight {
  _id: string;
  weighDate: Date;
  weighAmt: number;
  weighComments: string;
}

const weightSchema = new Schema<IWeight>(
  {
    weighDate: { type: Date, required: true },
    weighAmt: { type: Number, required: true },
    weighComments: { type: String, required: false },
  },
  { toJSON: { virtuals: true } }
);

export const Weight = model<IWeight>('Pet', weightSchema);
