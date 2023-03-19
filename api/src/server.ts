import cors from 'cors';
import express, { Application } from 'express';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import router from './routes/index';

const IS_PRODUCTION: boolean = process.env.NODE_ENV === 'production';
const LOG_MODE: string = IS_PRODUCTION ? 'common' : 'dev';
const PORT: string = process.env.PORT as string;

const app: Application = express();

if (IS_PRODUCTION) {
  app.use(cors({ origin: true }));
  app.options('*', cors());
  console.log('Cors Enabled');
}

app.use(morgan(LOG_MODE));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}...`);
});

export default app;
