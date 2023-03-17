import mongoose from 'mongoose';

const db = mongoose;
db.connection.on('error', (err: any) => {
  console.log(`Mongoose connection err:\n${err}`);
});

export default db;
