const express = require("express");
const { registerUser } = require("../controllers/userController");

const userRouter = express.Router();

//Public
userRouter.post("/register", registerUser);

module.exports = userRouter;
