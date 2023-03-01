import { Schema, model } from 'mongoose';

export interface IVet {
  _id: string;
  visitDate: string;
  visitVet: string;
  visitReason: string;
  visitComments: string;
  petId: string;
}

export const vetSchema = new Schema<IVet>(
  {
    visitDate: { type: String, required: true },
    visitVet: { type: String, required: true },
    visitReason: { type: String, required: true },
    visitComments: { type: String, required: false },
    petId: { type: String, required: true },
  },
  { toJSON: { virtuals: true } }
);

export const vetVisit = model<IVet>('vetVisit', vetSchema);
