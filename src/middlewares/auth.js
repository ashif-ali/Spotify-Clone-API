const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

// Middleware to protect routes - verify JWT token and set req.user
const protect = async function (req, res, next) {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get the token from the header
            token = req.headers.authorization.split(" ")[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT);
            // Fetch user, exclude password
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: "Not authorized, user not found" });
            }
            next();
        } catch (error) {
            console.error(error);
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "Not authorized, token failed" });
        }
    } else {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Not authorized, no token" });
    }
};

// Middleware to check if user is an admin
const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(StatusCodes.FORBIDDEN);
        throw new Error("Not authorized as an admin");
    }
});

module.exports = {
    protect,
    isAdmin,
};
