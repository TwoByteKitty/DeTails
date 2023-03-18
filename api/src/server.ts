import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import morgan from 'morgan';
import path from 'path';
import db from './config/db';
import router from './routes/index';
import { FILE_UPLOAD_PATH } from './utils/constants';

const ENV_PATH = path.resolve(__dirname, '..', '..', '.env');
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: ENV_PATH,
  });
}

//-- Constants ---------------------------------------------------------------
const LOG_MODE: string = process.env.NODE_ENV === 'production' ? 'common' : 'dev';
const IMAGE_UPLOAD_PATH = path.join(__dirname, '..', '..', '..', FILE_UPLOAD_PATH);

//-- .env --------------------------------------------------------------------
const DB_CONNECTION_STRING = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DeTail';

//-- Express -----------------------------------------------------------------
const app: Application = express();

//-- Mongoose Setup ----------------------------------------------------------
db.connect(DB_CONNECTION_STRING);

if (process.env.NODE_ENV === 'production') {
  app.use(cors());
}

//-- Middleware --------------------------------------------------------------
app.use(morgan(LOG_MODE));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.options('*', cors());

//-- Controller Routes -------------------------------------------------------
app.use('/images', express.static(IMAGE_UPLOAD_PATH));
app.use('/api', router);

export default app;
