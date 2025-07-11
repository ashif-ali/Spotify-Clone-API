const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnect");

//Load environment variables
dotenv.config();

const app = express();
connectDB();

const PORT = 3000;
app.listen(PORT, console.log("Server listening at port... 3000"));
