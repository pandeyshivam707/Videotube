import {app} from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Hey ! Code is running on PORT ${PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB error :" ,err);
})

app.get('/', (req,res) => {
    res.send("Hey ! I am the best coder ! ");
})