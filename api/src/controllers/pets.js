const Pet = require('../models/pet.js');

function getAllPets(request, response) {
    Pet.find()
        .sort({ date: -1 })
        .then(foundPets => res.json(foundPets))
        .catch(err => res.status(422).json(err));
}

module.exports = {
    getAllPets
}