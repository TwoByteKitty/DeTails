import { Request, Response } from 'express';
import { Weight, IWeight } from '../models/weight';

const addWeight = (request: Request<{ petId: string }, {}, IWeight>, response: Response) => {
  const newWeight: IWeight = request.body;
  newWeight.petId = request.params.petId;
  Weight.create(newWeight)
    .then((createdWeight: IWeight) => response.json(createdWeight))
    .catch((err: any) => response.status(500).json(err));
};

const getAllWeightsByPet = (request: Request<{ petId: string }>, response: Response) => {
  Weight.find({ petId: request.params.petId })
    .sort({ date: -1 })
    .then((foundWeights: Array<IWeight>) => response.json(foundWeights))
    .catch((err: any) => response.status(422).json(err));
};

const getSingleWeight = (request: Request<{ shedId: string }>, response: Response) => {
  Weight.findById(request.params.shedId)
    .then((foundWeight: any) => response.json(foundWeight))
    .catch((err: any) => response.status(422).json(err));
};

const editWeight = (request: Request<{}, {}, IWeight>, response: Response) => {
  const petWeight: IWeight = request.body;
  Weight.findByIdAndUpdate(petWeight._id, petWeight)
    .then((updatedWeight) => response.json(updatedWeight))
    .catch((err) => response.status(500).json(err));
};

export { getAllWeightsByPet, addWeight, getSingleWeight, editWeight };
