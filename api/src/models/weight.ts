import { Schema, model } from 'mongoose';

export interface IWeight {
  _id: string;
  weighDate: Date;
  weighAmt: number;
  weighUnit: string;
  weighComments: string;
  petId: string;
}

export const weightSchema = new Schema<IWeight>(
  {
    weighDate: { type: Date, required: true },
    weighAmt: { type: Number, required: true },
    weighUnit: { type: String, required: false },
    weighComments: { type: String, required: false },
    petId: { type: String, required: true },
  },
  { toJSON: { virtuals: true } }
);

export const Weight = model<IWeight>('Weight', weightSchema);
