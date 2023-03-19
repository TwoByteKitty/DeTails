import dotenv from 'dotenv';
import path from 'path';

//-- .env --------------------------------------------------------------------
const ENV_PATH = path.resolve(__dirname, '..', '.env');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: ENV_PATH,
  });
}

require('./src/services/db');
require('./src/server');
