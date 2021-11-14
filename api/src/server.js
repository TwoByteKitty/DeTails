const morgan = require('morgan');
const express = require('express');

const router = require('./routes/index.js');
const db = require('./config/db.js');

//-- .env --------------------------------------------------------------------
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config({
//     path: path.resolve(__dirname, '.env')
//   });
// }

//-- Dependencies ------------------------------------------------------------
// const { passport } = require('./lib/passport');
// const { db } = require('./lib/db');

//-- Constants ---------------------------------------------------------------

const LOG_MODE = process.env.NODE_ENV === 'production' ? 'common' : 'dev';

//-- Express -----------------------------------------------------------------
const app = express();

//-- TODO Mongoose Setup ----------------------------------------------------------
db.connect(
    process.env.MONGODB_URI ||
    'mongodb://localhost/DeTail'
)
db.connection.on('error', err => {
    console.log(`Mongoose connection err:\n${err}`)
})

//-- Middleware --------------------------------------------------------------
app.use(morgan(LOG_MODE));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(passport.initialize());

//-- Static Server (Production) ----------------------------------------------
// if (process.env.NODE_ENV === 'production') {
//   const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
//   console.log(`Client build path: ${clientBuildPath}\n`);
//   app.use(express.static(clientBuildPath));
// }

//-- Controller Routes -------------------------------------------------------
app.use('/api', router);

//-- React catch-all ---------------------------------------------------------
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

module.exports = app;