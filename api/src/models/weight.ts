import { Schema, model } from 'mongoose';

export interface IWeight {
  _id: string;
  weighDate: Date;
  weighAmt: number;
  weighComments: string;
  petId: string;
}

export const weightSchema = new Schema<IWeight>(
  {
    weighDate: { type: Date, required: true },
    weighAmt: { type: Number, required: true },
    weighComments: { type: String, required: false },
    petId: { type: String, required: true },
  },
  { toJSON: { virtuals: true } }
);

export const Weight = model<IWeight>('Weight', weightSchema);
