import dotenv from 'dotenv';
import express, { Application } from 'express';
import morgan from 'morgan';
import path from 'path';
import db, { DB_CONNECTION_STRING } from './config/db';
import router from './routes/index';
import { FILE_UPLOAD_PATH } from './utils/constants';

//-- Constants ---------------------------------------------------------------
const LOG_MODE: string = process.env.NODE_ENV === 'production' ? 'common' : 'dev';
const ENV_PATH = path.resolve(__dirname, '..', '..', '.env');
const IMAGE_UPLOAD_PATH = path.join(__dirname, '..', '..', '..', FILE_UPLOAD_PATH);

//-- .env --------------------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: ENV_PATH,
  });
}

//-- Express -----------------------------------------------------------------
const app: Application = express();

//-- Mongoose Setup ----------------------------------------------------------
db.connect(DB_CONNECTION_STRING);

//-- Middleware --------------------------------------------------------------
app.use(morgan(LOG_MODE));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/images', express.static(IMAGE_UPLOAD_PATH));

//-- Controller Routes -------------------------------------------------------
app.use('/api', router);

export default app;
