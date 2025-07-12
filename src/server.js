const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnect");
const userRouter = require("./routes/userRoutes");
const { StatusCodes } = require("http-status-codes");

//Load environment variables
dotenv.config();

const app = express();
connectDB();

//Pass incoming data
app.use(express.json());

//Routes
app.use("/api/users", userRouter);

//Handling error using middleware
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = StatusCodes.NOT_FOUND;
    next(error);
});
//Global error handler
app.use((err, req, res, next) => {
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message || "Internal server Error",
        status: "error",
    });
});

const PORT = 3000;
app.listen(PORT, console.log("Server listening at port... 3000"));
