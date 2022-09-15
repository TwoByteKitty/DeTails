import db from '../config/db';

const Schema = db.Schema;

const petSchema = new Schema({
  name: { type: String, required: true },
  health: { type: Number, required: true, default: 100 }
});

export const Pet = db.model("Pet", petSchema);