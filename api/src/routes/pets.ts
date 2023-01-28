import express, { Router } from 'express';
import multer from 'multer';
import { addPet, editPet, addPetImage, getAllPets, getSinglePet } from '../controllers/pets';
import { FILE_UPLOAD_PATH } from '../utils/constants';

const router: Router = express.Router();

const upload = multer({
  dest: FILE_UPLOAD_PATH,
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

router.get('/', getAllPets);
router.get('/:id', getSinglePet);
router.put('/:id', editPet);
router.post('/:id/addImage', upload.single('petImage'), addPetImage);
router.post('/add', addPet);

export default router;
