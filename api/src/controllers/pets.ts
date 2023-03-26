import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { DateTime } from 'luxon';
import { IPetImage, PetImage } from '../models/petImage';
import { IPet, Pet } from '../models/pet';
import { User } from '../models/user';
import { getUploadParams, s3Client } from '../services/s3';
import {
  FEEDINGS_VIRTUAL_NAME,
  IMAGES_VIRTUAL_NAME,
  SHEDS_VIRTUAL_NAME,
  WEIGHTS_VIRTUAL_NAME,
} from '../utils/constants';
interface IPetRequestBody {
  userName: string;
}
interface IAddPetRequestBody extends IPet {
  pet: IPet;
  userName: string;
}

const getAllPets = async (request: Request<{}, {}, IPetRequestBody>, response: Response) => {
  const { userName } = request.body;
  try {
    const user = await User.findOne({ userName });
    if (user === null) {
      throw new Error('User not found');
    }
    const foundPets = await Pet.find({ ownerId: user?._id }).sort({ date: -1 });
    response.json(foundPets);
  } catch (error) {
    response.status(422).json(error);
  }
};

const addPet = async (request: Request<{}, {}, IAddPetRequestBody>, response: Response) => {
  const { userName } = request.body;
  const { pet } = request.body;
  try {
    const user = await User.findOne({ userName });
    if (user === null) {
      throw new Error('User not found');
    }
    const createdPet = await Pet.create({ ...pet, ownerId: user?._id });
    response.json(createdPet);
  } catch (error: any) {
    response.status(500).json(error);
  }
};

const editPet = (request: Request<{}, {}, IPet>, response: Response) => {
  const pet: IPet = request.body;
  Pet.findByIdAndUpdate(pet._id, pet)
    .then((updatedPet: any) => response.json(updatedPet))
    .catch((err: any) => response.status(500).json(err));
};

const addMealSchedule = (request: Request<{}, {}, { _id: string; mealSchedule: Array<{}> }>, response: Response) => {
  const { _id, mealSchedule } = request.body;
  Pet.findByIdAndUpdate(_id, { mealSchedule })
    .then((updatedPet: any) => response.json(updatedPet))
    .catch((err: any) => response.status(500).json(err));
};

const addPetImage = async (
  request: Request<{ id: string }, {}, { imageTitle: string; isThumbnail: boolean }>,
  response: Response
) => {
  const { files } = request;
  const { imageTitle, isThumbnail } = request.body;
  if (files) {
    const fileToUpload = files.petImage as UploadedFile;
    try {
      const uploadParams = getUploadParams(fileToUpload);
      await s3Client.send(new PutObjectCommand(uploadParams));

      const image: IPetImage = {
        uploadDate: DateTime.now().toLocaleString(),
        imageTitle,
        imagePath: `${process.env.AWS_BUCKET_URI}/${uploadParams.Key}`,
        isThumbnail,
        petId: request.params.id,
      };

      const savedImage = await PetImage.create(image);
      response.json(savedImage);
    } catch (err: any) {
      response.status(500).json(err);
    }
  } else {
    response.status(422).end({ message: 'No image found' });
  }
};

const editPetImage = async (
  request: Request<{ id: string }, {}, Omit<IPetImage, 'imagePath, uploadDate, petId'>>,
  response: Response
) => {
  const petImage = request.body;
  if (petImage.isThumbnail) {
    await PetImage.updateMany({ petId: request.params.id, isThumbnail: true }, { isThumbnail: false });
  }
  PetImage.findByIdAndUpdate(petImage._id, petImage)
    .then((updatedPet: any) => response.json(updatedPet))
    .catch((err: any) => response.status(500).json(err));
};

const deletePetImage = (
  request: Request<{ id: string }, {}, Omit<IPetImage, 'imagePath, uploadDate, petId, imageTitle, isThumbnail'>>,
  response: Response
) => {
  const petImage = request.body;
  PetImage.findByIdAndDelete(petImage._id)
    .then((updatedPet: any) => response.json(updatedPet))
    .catch((err: any) => response.status(500).json(err));
};

const getSinglePet = (request: Request<{ id: string }>, response: Response) => {
  Pet.findById(request.params.id)
    .populate({ path: FEEDINGS_VIRTUAL_NAME, options: { sort: { feedDate: 1 } } })
    .populate({ path: SHEDS_VIRTUAL_NAME, options: { sort: { pinkBelly: 1 } } })
    .populate({ path: WEIGHTS_VIRTUAL_NAME, options: { sort: { weighDate: 1 } } })
    .populate({ path: IMAGES_VIRTUAL_NAME, options: { sort: { uploadDate: 1 } } })
    .then((foundPet: any) => response.json(foundPet))
    .catch((err: any) => response.status(422).json(err));
};

export { getAllPets, addPet, editPet, getSinglePet, addPetImage, addMealSchedule, editPetImage, deletePetImage };
