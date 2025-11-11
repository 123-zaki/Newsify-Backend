import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db_url = process.env.DB_URI || "";

// Cache the connection across lambda/container invocations to avoid
// exhausting MongoDB connections in serverless environments (Vercel, AWS Lambda, etc.)
// We store the cache on the global object so it survives module reloads in the same Node.js process.
const globalAny = global;
if (!globalAny._mongoose) {
  globalAny._mongoose = { conn: null, promise: null };
}

export async function connectDb() {
  if (globalAny._mongoose.conn) {
    return globalAny._mongoose.conn;
  }

  if (!globalAny._mongoose.promise) {
    // create a single promise that resolves to the mongoose connection
    globalAny._mongoose.promise = mongoose
      .connect(db_url, {
        // recommended options can go here; mongoose 6+ has sensible defaults
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      })
      .then((mongooseInstance) => {
        globalAny._mongoose.conn = mongooseInstance.connection;
        console.log("Database connected successfully");
        return globalAny._mongoose.conn;
      })
      .catch((err) => {
        // clear promise so future attempts can retry
        globalAny._mongoose.promise = null;
        console.error("Database connection failed:", err);
        throw err;
      });
  }

  return globalAny._mongoose.promise;
}
