import { Schema, model } from 'mongoose';
import moment from 'moment';

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
}

const petSchema = new Schema<IPet>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    species: { type: String, required: true },
    sex: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    description: { type: String, required: true },
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
