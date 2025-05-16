import * as dotenv from "dotenv";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import morgan from "morgan";
import router from "./router";

dotenv.config();
import { setSuperAdmin } from "./db/user";

const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const server = http.createServer(app);
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
const MONGO_URL = process.env.MONGODB_URL;
if (!MONGO_URL) throw Error("missing mongo connection string");

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => {
  console.log(error);
});
mongoose.connection.on("connected", () => {
  console.log("Mongo Database connected");
  setSuperAdmin();
  app.use("/", router());
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongo Database disconnected");
});
