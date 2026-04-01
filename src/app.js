import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// import Routes
import healthCheckRouter from "./routes/healthcheck.routes.js"
import userRoute from "./routes/user.routes.js"

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
)



app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());


app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRoute);
export { app }; 