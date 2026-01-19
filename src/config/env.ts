import dotenv from "dotenv";

dotenv.config();

const config = {
  MONGO_URI: process.env.MONGO_URI || "",
  DB_NAME: process.env.DB_NAME || "ellty-db",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_change_this_in_production",
};

if (!config.MONGO_URI) {
  throw new Error("MONGO_URI is required in environment variables");
}

export default config;
