import { model, Schema } from 'mongoose';

export interface IPetImage {
  _id?: string;
  uploadDate: string;
  imageTitle: string;
  imagePath: string;
  petId: string;
}

export const petImageSchema = new Schema<IPetImage>({
  uploadDate: { type: String, required: true },
  imageTitle: { type: String, required: true },
  imagePath: { type: String, required: true },
  petId: { type: String, required: true },
});

export const PetImage = model<IPetImage>('PetImage', petImageSchema);
