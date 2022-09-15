import { Schema, model } from 'mongoose';

export interface IPet {
	name: string;
	health: number;
}

const petSchema = new Schema<IPet>({
	name: { type: String, required: true },
	health: { type: Number, required: true, default: 100 },
});

export const Pet = model<IPet>('Pet', petSchema);
