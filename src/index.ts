import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import http from "http";
import mongoose from "mongoose";
import router from "./router";

dotenv.config();

const app = express();
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

const MONGO_URI = process.env.MONGO_URI!;
mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);

mongoose.connection.on("error", (error: Error) => {
  console.log("mongoose error:=>", error);
});

app.use("/", router());
