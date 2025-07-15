const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

/**
 * @desc - register a new user
 * @route - POST /api/users/register
 * @Access - Public
 */

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(StatusCodes.BAD_REQUEST);
            throw new Error("User already exists");
        }
        const user = await User.create({
            name,
            email,
            password,
        });
        if (user) {
            res.status(StatusCodes.CREATED).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                profilePicture: user.profilePicture,
            });
        } else {
            res.status(StatusCodes.BAD_REQUEST);
            throw new Error("Invalid user data");
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: error.message,
        });
    }
};

// const registerUser = asyncHandler(async (req, res) => {
//     const { name, email, password } = req.body;
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//         res.status(StatusCodes.BAD_REQUEST);
//         throw new Error("User already exists");
//     }

//     //Create the user now
//     const user = await User.create({
//         name,
//         email,
//         password,
//     });

//     if (user) {
//         res.status(StatusCodes.CREATED).json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             isAdmin: user.isAdmin,
//             profilePicture: user.profilePicture,
//         });
//     } else {
//         res.status(StatusCodes.BAD_REQUEST);
//         throw new Error("Invalid user data");
//     }
// });

//@desc - Login user
//@route - POST /api/users/login
//@Access - Public

/**
 * @desc - Login user
 * @route - POST /api/users/login
 * @access - Public
 */

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        //find the user
        const user = await User.findOne({ email });
        //check if user exits and password matches
        if (user && (await user.matchPassword(password))) {
            res.status(StatusCodes.OK).json({
                _id: user._id,
                email: user.email,
                isAdmin: user.isAdmin,
                profilePicture: user.profilePicture,
                token: generateToken(user._id),
            });
        } else {
            res.status(StatusCodes.UNAUTHORIZED);
            throw new Error("Invalid email or password");
        }
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            error: error.message,
        });
    }
};

// const loginUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     //find the user
//     const user = await User.findOne({ email });
//     //Check if user exits and password matches
//     if (user && (await user.matchPassword(password))) {
//         res.status(StatusCodes.OK).json({
//             _id: user._id,
//             email: user.email,
//             isAdmin: user.isAdmin,
//             profilePicture: user.profilePicture,
//             token: generateToken(user._id),
//         });
//     } else {
//         res.status(StatusCodes.UNAUTHORIZED);
//         throw new Error("Invalid email or password");
//     }
// });

//* Get user profile

const getUserProfile = async (req, res) => {
    try {
        // Check if req.user exists
        if (!req.user || !req.user._id) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "Unauthorized, user not available" });
        }

        // Find the user, exclude password and _id
        const user = await User.findById(req.user._id).select("-password -_id");

        if (user) {
            res.status(StatusCodes.OK).json(user);
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Server error" });
    }
};

//! update user profile
const updateUserProfile = asyncHandler(async function (req, res) {
    console.log("update profile");
    const user = await User.findById(req.user._id);
    const { name, email, password } = req.body;
    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;

        //check if user is updating the password field
        if (password) {
            user.password = password;
        }
        //Upload profile picture if provided
        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.path,
                "spotify/users"
            );
            user.profilePicture = result.secure_url;
        }
        const updatedUser = await user.save();
        res.status(StatusCodes.OK).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("User Not Found");
    }
});

//! toggle like song
//! toggle follow artist
//! toggle follow playlist
//! get users

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};
