import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { IPet, Pet } from '../models/pet';
import { FEEDINGS_VIRTUAL_NAME, FILE_UPLOAD_PATH, SHEDS_VIRTUAL_NAME, WEIGHTS_VIRTUAL_NAME } from '../utils/constants';

const getAllPets = (request: Request, response: Response) => {
  Pet.find()
    .sort({ date: -1 })
    .then((foundPets: Array<IPet>) => response.json(foundPets))
    .catch((err: any) => response.status(422).json(err));
};

const addPet = (request: Request<{}, {}, IPet>, response: Response) => {
  const newPet: IPet = request.body;
  Pet.create(newPet)
    .then((createdPet: IPet) => response.json(createdPet))
    .catch((err: any) => response.status(500).json(err));
};

const editPet = (request: Request<{}, {}, IPet>, response: Response) => {
  const pet: IPet = request.body;
  pet.dateOfBirth = new Date(pet.dateOfBirth);
  Pet.findByIdAndUpdate(pet._id, pet)
    .then((updatedPet: any) => response.json(updatedPet))
    .catch((err: any) => response.status(500).json(err));
};

const addMealSchedule = (request: Request<{}, {}, { _id: string; mealSchedule: Array<{}> }>, response: Response) => {
  const { _id, mealSchedule } = request.body;
  Pet.findByIdAndUpdate(_id, { $set: { mealSchedule } })
    .then((updatedPet: any) => response.json(updatedPet))
    .catch((err: any) => response.status(500).json(err));
};

const addPetImage = (request: Request<{ id: string }>, response: Response) => {
  const { file } = request;
  if (file) {
    const tmp_path = file.path;

    /** The original name of the uploaded file
      stored in the variable "originalname". **/
    const target_path = path.join(__dirname, '..', '..', '..', '..', FILE_UPLOAD_PATH, file.originalname);

    /** A better way to copy the uploaded file. **/
    const src = fs.createReadStream(tmp_path);
    const dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', () => {
      fs.rmSync(tmp_path);
      Pet.findByIdAndUpdate(request.params.id, { $push: { petImages: file.originalname } }, { new: true, upsert: true })
        .then((updatedPet: IPet) => response.json(updatedPet))
        .catch((err: any) => response.status(500).json(err));
    });
    src.on('error', (err) => {
      response.status(403).end('Failed to save file.');
    });
  } else {
    response.status(403).end('No file found');
  }
};

const getSinglePet = (request: Request<{ id: string }>, response: Response) => {
  Pet.findById(request.params.id)
    .populate({ path: FEEDINGS_VIRTUAL_NAME, options: { sort: { feedDate: 1 } } })
    .populate({ path: SHEDS_VIRTUAL_NAME, options: { sort: { pinkBelly: 1 } } })
    .populate({ path: WEIGHTS_VIRTUAL_NAME, options: { sort: { weighDate: 1 } } })
    .then((foundPet: any) => response.json(foundPet))
    .catch((err: any) => response.status(422).json(err));
};

export { getAllPets, addPet, editPet, getSinglePet, addPetImage, addMealSchedule };
