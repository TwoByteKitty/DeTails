import dotenv from 'dotenv';
import path from 'path';
import app from './src/server';

const ENV_PATH = path.resolve(__dirname, '..', '.env');

//-- .env --------------------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: ENV_PATH,
  });
}

const PORT = process.env.PORT || 3001;

//-- Main --------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}...`);
});
