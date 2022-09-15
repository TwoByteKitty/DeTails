import { Request, Response } from 'express';
import { Pet } from '../models/pet';

function getAllPets(request: Request, response: Response) {
	Pet.find()
		.sort({ date: -1 })
		.then((foundPets) => response.json(foundPets))
		.catch((err) => response.status(422).json(err));
}

export { getAllPets };
