import { Request, Response } from 'express';
import { Feeding, IFeed } from '../models/feeding';

const addFeeding = (request: Request<{ petId: string }, {}, IFeed>, response: Response) => {
  const newFeeding: IFeed = request.body;
  newFeeding.petId = request.params.petId;
  Feeding.create(newFeeding)
    .then((createdFeeding: IFeed) => response.json(createdFeeding))
    .catch((err) => response.status(500).json(err));
};

const getAllFeedingsByPet = (request: Request<{ petId: string }>, response: Response) => {
  Feeding.find({ petId: request.params.petId })
    .sort({ date: -1 })
    .then((foundFeedings) => response.json(foundFeedings))
    .catch((err) => response.status(422).json(err));
};

const getSingleFeeding = (request: Request<{ shedId: string }>, response: Response) => {
  Feeding.findById(request.params.shedId)
    .then((foundFeeding) => response.json(foundFeeding))
    .catch((err) => response.status(422).json(err));
};

//needs more work!
// const editFeeding = (request: Request<{}, {}, IFeed>, response: Response) => {
//   const pet: IFeed = request.body;
//   pet.dateOfBirth = new Date(pet.dateOfBirth);
//   Feeding.findByIdAndUpdate(pet._id, pet)
//     .then((updatedFeeding) => response.json(updatedFeeding))
//     .catch((err) => response.status(500).json(err));
// };

export { getAllFeedingsByPet, addFeeding, getSingleFeeding };
