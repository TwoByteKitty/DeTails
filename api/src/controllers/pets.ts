import { Request, Response } from 'express';
import { IPet, Pet } from '../models/pet';

const getAllPets = (request: Request, response: Response) => {
  Pet.find()
    .sort({ date: -1 })
    .then((foundPets) => response.json(foundPets))
    .catch((err) => response.status(422).json(err));
};

const addPet = (request: Request<{}, {}, IPet>, response: Response) => {
  const newPet: IPet = request.body;
  Pet.create(newPet)
    .then((createdPet: IPet) => response.json(createdPet))
    .catch((err) => response.status(500).json(err));
};

const editPet = (request: Request<{}, {}, IPet>, response: Response) => {
  const pet: IPet = request.body;
  Pet.findByIdAndUpdate(pet._id, pet)
    .then((updatedPet) => response.json(updatedPet))
    .catch((err) => response.status(500).json(err));
};

const getSinglePet = (request: Request<{ id: string }>, response: Response) => {
  Pet.findById(request.params.id)
    .then((foundPet) => response.json(foundPet))
    .catch((err) => response.status(422).json(err));
};

export { getAllPets, addPet, editPet, getSinglePet };
