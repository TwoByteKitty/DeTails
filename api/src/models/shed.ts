import { Schema, model, Date } from 'mongoose';
import moment from 'moment';

// Need to add a prop [petID],
// to link these with the correct pet
export interface IShed {
  _id: string;
  pinkBelly: Date;
  blueEyes: Date;
  clearEyes: Date;
  shedSkin: Date;
  entire: boolean;
  shedComments: string;
}

const shedSchema = new Schema<IShed>(
  {
    pinkBelly: { type: Date, required: true },
    blueEyes: { type: Date, required: true },
    clearEyes: { type: Date, required: true },
    shedSkin: { type: Date, required: true },
    entire: { type: Boolean, required: true },
    shedComments: { type: String, required: false },
  },
  { toJSON: { virtuals: true } }
);
//===============================This arg should be the name of the table in the dB
export const Shed = model<IShed>('Pet', shedSchema);
