import { Request, Response } from 'express';
import { Shed, IShed } from '../../models/herpetofauna/shed';

const addShed = (request: Request<{ petId: string }, {}, IShed>, response: Response) => {
  const newShed: IShed = request.body;
  newShed.petId = request.params.petId;
  Shed.create(newShed)
    .then((createdShed: IShed) => response.json(createdShed))
    .catch((err: any) => response.status(500).json(err));
};

const getAllShedsByPet = (request: Request<{ petId: string }>, response: Response) => {
  Shed.find({ petId: request.params.petId })
    .sort({ date: -1 })
    .then((foundSheds: Array<IShed>) => response.json(foundSheds))
    .catch((err: any) => response.status(422).json(err));
};

const getSingleShed = (request: Request<{ shedId: string }>, response: Response) => {
  Shed.findById(request.params.shedId)
    .then((foundShed: any) => response.json(foundShed))
    .catch((err: any) => response.status(422).json(err));
};

//needs more work!
// const editShed = (request: Request<{}, {}, IShed>, response: Response) => {
//   const pet: IShed = request.body;
//   pet.dateOfBirth = new Date(pet.dateOfBirth);
//   Shed.findByIdAndUpdate(pet._id, pet)
//     .then((updatedShed) => response.json(updatedShed))
//     .catch((err) => response.status(500).json(err));
// };

export { getAllShedsByPet, addShed, getSingleShed };
