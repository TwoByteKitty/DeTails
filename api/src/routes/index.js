const router =  require('express').Router();

const petsRouter = require('./pets.js');

router.use('/pets', petsRouter);

module.exports = router;