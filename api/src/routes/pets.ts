import express, { Router } from 'express';
import { addFeeding, getAllFeedingsByPet, getSingleFeeding } from '../controllers/herpetofauna/feedings';
import { addShed, getAllShedsByPet, getSingleShed } from '../controllers/herpetofauna/sheds';
import { addMealSchedule, addPet, addPetImage, editPet, getAllPets, getSinglePet } from '../controllers/pets';
import { addWeight, editWeight, getAllWeightsByPet, getSingleWeight } from '../controllers/weights';

const router: Router = express.Router();

// Pets CRUD
router.post('/', getAllPets);
router.get('/:id', getSinglePet);
router.put('/:id', editPet);
router.put('/:id/feeding-schedule', addMealSchedule);
router.post('/:id/addImage', addPetImage);
router.post('/add', addPet);

//Sheds CRUD
router.post('/:petId/sheds/add', addShed);
router.get('/:petId/sheds/:shedId', getSingleShed);
router.get('/:petId/sheds/', getAllShedsByPet);

//Feeding CRUD
router.post('/:petId/feedings/add', addFeeding);
router.get('/:petId/feedings/:feedingId', getSingleFeeding);
router.get('/:petId/feedings/', getAllFeedingsByPet);

//Weights CRUD
router.post('/:petId/weights/add', addWeight);
router.get('/:petId/weights/:weightId', getSingleWeight);
router.get('/:petId/weights/', getAllWeightsByPet);
router.put('/weights/:weightId', editWeight);

export default router;
