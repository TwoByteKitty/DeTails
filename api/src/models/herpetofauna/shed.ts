import { Schema, model, Date } from 'mongoose';

export interface IShed {
  _id: string;
  pinkBelly: string;
  blueEyes: string;
  clearEyes: string;
  shedSkin: string;
  entire: string;
  shedComments: string;
  petId: string;
}

export const shedSchema = new Schema<IShed>(
  {
    pinkBelly: { type: String, required: true },
    blueEyes: { type: String, required: true },
    clearEyes: { type: String, required: true },
    shedSkin: { type: String, required: true },
    entire: { type: String, required: true },
    shedComments: { type: String, required: false },
    petId: { type: String, required: true },
  },
  { toJSON: { virtuals: true } }
);

export const Shed = model<IShed>('Shed', shedSchema);
