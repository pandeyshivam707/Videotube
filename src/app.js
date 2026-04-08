import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import {errorHandler} from "./middlewares/error.middlewares.js";
import CORS from "cors";

const app = express();

app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true, limit : "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(CORS());

app.use("/api/v1/users", userRouter);

app.use(errorHandler);

export {app};

