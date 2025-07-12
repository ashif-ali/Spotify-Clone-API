const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnect");
const userRouter = require("./routes/userRoutes");

//Load environment variables
dotenv.config();

const app = express();
connectDB();

//Pass incoming data
app.use(express.json());

//Routes
app.use("/api/users", userRouter);
const PORT = 3000;
app.listen(PORT, console.log("Server listening at port... 3000"));
