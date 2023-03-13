import { Schema, model } from 'mongoose';

export interface IImage {
  _id: string;
  uploadDate: string;
  imageTitle: string;
  imagePath: string;
  petId: string;
}

export const imageSchema = new Schema<IImage>(
  {
    uploadDate: { type: String, required: true },
    imageTitle: { type: String, required: true },
    imagePath: { type: String, required: true },
    petId: { type: String, required: true },
  },
  { toJSON: { virtuals: true } }
);

export const image = model<IImage>('image', imageSchema);
