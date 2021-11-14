const router =  require('express').Router();

const { getAllPets } = require('../controllers/pets.js');

router.get('/', getAllPets);

module.exports = router;