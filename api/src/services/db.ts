import mongoose from "mongoose";

const DB_CONNECTION_STRING =
  process.env.MONGODB_URI || "mongodb://127.0.0.1/DeTail";

const db = mongoose;
db.connection.on("error", (err: any) => {
  console.log(`Mongoose connection err:\n${err}`);
});

db.connect(DB_CONNECTION_STRING);

export default db;
