import { Schema, model, Date } from 'mongoose';

export interface IShed {
  _id: string;
  pinkBelly: Date;
  blueEyes: Date;
  clearEyes: Date;
  shedSkin: Date;
  entire: string;
  shedComments: string;
  petId: string;
}

export const shedSchema = new Schema<IShed>(
  {
    pinkBelly: { type: Date, required: true },
    blueEyes: { type: Date, required: true },
    clearEyes: { type: Date, required: true },
    shedSkin: { type: Date, required: true },
    entire: { type: String, required: true },
    shedComments: { type: String, required: false },
    petId: { type: String, required: true },
  },
  { toJSON: { virtuals: true } }
);

export const Shed = model<IShed>('Shed', shedSchema);
