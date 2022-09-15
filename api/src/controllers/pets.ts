import { Request, Response } from 'express';
import { IPet, Pet } from '../models/pet';

const getAllPets = (request: Request, response: Response) => {
	Pet.find()
		.sort({ date: -1 })
		.then((foundPets) => response.json(foundPets))
		.catch((err) => response.status(422).json(err));
};

const addPet = (request: Request, response: Response) => {
	const newPet: IPet = request.body;
	Pet.create(newPet)
		.then((createdPet: IPet) => response.json(createdPet))
		.catch((err) => response.status(500).json(err));
};

export { getAllPets, addPet };
