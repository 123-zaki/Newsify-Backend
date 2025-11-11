import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDb } from "./db/db.js";

dotenv.config();

const port = process.env.PORT || 3000;

// Only run the listener locally (not on Vercel)
if (!process.env.VERCEL) {
  connectDb()
    .then(() => {
      app.listen(port, () => {
        console.log("Server is listening on port:", port);
      });
    })
    .catch((error) => {
      console.error("Failed to connect to database:", error);
      process.exit(1);
    });
}

// Export for Vercel serverless function
export default async function handler(req, res) {
  try {
    await connectDb();
    return app(req, res);
  } catch (error) {
    console.error("Failed to connect to database:", error);
    res.status(500).send("Internal Server Error");
  }
}
