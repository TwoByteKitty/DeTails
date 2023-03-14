import mongoose from 'mongoose';

export const DB_CONNECTION_STRING = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DeTail';

const db = mongoose;
db.connection.on('error', (err: any) => {
  console.log(`Mongoose connection err:\n${err}`);
});

export default db;
