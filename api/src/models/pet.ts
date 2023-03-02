import { Schema, model } from 'mongoose';
// import moment from 'moment';
import { IShed, shedSchema } from './herpetofauna/shed';
import { IFeed, feedingSchema } from './herpetofauna/feeding';
import { IWeight, weightSchema } from './weight';
import { IVet, vetSchema } from './vetVisit';
import {
  WEIGHTS_VIRTUAL_NAME,
  SHEDS_VIRTUAL_NAME,
  FEEDINGS_VIRTUAL_NAME,
  VISITS_VIRTUAL_NAME,
} from '../utils/constants';

export type PetType = 'cat' | 'dog' | 'reptile' | 'amphibian' | 'fish' | 'lizard';
export type SexType = 'male' | 'female';

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
  feedingSchedule: Array<{}>;
  feedingHistory: Array<IFeed>;
  shedHistory: Array<IShed>;
  weightHistory: Array<IWeight>;
  vetHistory: Array<IVet>;
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
    feedingSchedule: { type: [{}], required: false },
  },
  { toJSON: { virtuals: true } }
);

petSchema.virtual('dateOfBirthFormatted').get(function () {
  // return moment(this.dateOfBirth).format('yyyy-MM-DD');
});

petSchema.virtual('age').get(function () {
  //return moment(this.dateOfBirth).subtract(this.d).format('YY');
});

petSchema.virtual(FEEDINGS_VIRTUAL_NAME, {
  ref: 'Feeding',
  localField: '_id',
  foreignField: 'petId',
});

petSchema.virtual(SHEDS_VIRTUAL_NAME, {
  ref: 'Shed',
  localField: '_id',
  foreignField: 'petId',
});

petSchema.virtual(WEIGHTS_VIRTUAL_NAME, {
  ref: 'Weight',
  localField: '_id',
  foreignField: 'petId',
});

petSchema.virtual(VISITS_VIRTUAL_NAME, {
  ref: 'VetVisit',
  localField: '_id',
  foreignField: 'petId',
});

export const Pet = model<IPet>('Pet', petSchema);
