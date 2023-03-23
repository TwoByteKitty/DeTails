import { model, Schema } from 'mongoose';
import {
  FEEDINGS_VIRTUAL_NAME,
  IMAGES_VIRTUAL_NAME,
  SHEDS_VIRTUAL_NAME,
  VISITS_VIRTUAL_NAME,
  WEIGHTS_VIRTUAL_NAME,
} from '../utils/constants';
import { IFeed } from './herpetofauna/feeding';
import { IShed } from './herpetofauna/shed';
import { IPetImage } from './petImage';
import { IVet } from './vetVisit';
import { IWeight } from './weight';

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
  petImages: Array<IPetImage>;
  mealSchedule: Array<{}>;
  feedingHistory: Array<IFeed>;
  shedHistory: Array<IShed>;
  weightHistory: Array<IWeight>;
  vetHistory: Array<IVet>;
  ownerId: string;
}

const petSchema = new Schema<IPet>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    species: { type: String, required: true },
    sex: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    description: { type: String, required: true },
    mealSchedule: { type: [{}], required: false },
    ownerId: { type: String, required: true },
  },
  { toJSON: { virtuals: true } }
);

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

petSchema.virtual(IMAGES_VIRTUAL_NAME, {
  ref: 'PetImage',
  localField: '_id',
  foreignField: 'petId',
});

export const Pet = model<IPet>('Pet', petSchema);
