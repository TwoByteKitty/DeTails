const db = require('../config/db.js');

const Schema = db.Schema;

const petSchema = new Schema({
  name: { type: String, required: true },
  health: { type: Number, required: true, default: 100 }
});

const Pet = db.model("Pet", petSchema);

module.exports = Pet;