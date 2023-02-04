import { Schema, model } from 'mongoose';
import moment from 'moment';
import { IShed, shedSchema } from './shed';
import { IFeed, feedingSchema } from './feeding';
import { IWeight, weightSchema } from './weight';

export type PetType = 'cat' | 'dog' | 'reptile' | 'amphibian' | 'fish' | 'lizard';
export type SexType = 'male' | 'female';

// Lets add some properties to our interface
// and schema for shed, feeding, and weight
// Arrays. Make them optional
export interface IPet {
  _id: string;
  name: string;
  type: PetType;
  species: string;
  sex: SexType;
  dateOfBirth: Date;
  dateOfBirthFormatted: string;
  description: string;
  petImages: Array<string>;
  feedingHistory: Array<IFeed>;
  shedHistory: Array<IShed>;
  weightHistory: Array<IWeight>;
}

const petSchema = new Schema<IPet>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    species: { type: String, required: true },
    sex: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    description: { type: String, required: true },
    petImages: { type: [String], required: false },
    feedingHistory: { type: [feedingSchema], required: false },
    shedHistory: { type: [shedSchema], required: false },
    weightHistory: { type: [weightSchema], required: false },
  },
  { toJSON: { virtuals: true } }
);

petSchema.virtual('dateOfBirthFormatted').get(function () {
  return moment(this.dateOfBirth).format('yyyy-MM-DD');
});

petSchema.virtual('age').get(function () {
  //return moment(this.dateOfBirth).subtract(this.d).format('YY');
});

export const Pet = model<IPet>('Pet', petSchema);
