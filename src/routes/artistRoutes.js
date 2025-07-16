const express = require("express");
const { protect, isAdmin } = require("../middlewares/auth");
const {
    createArtist,
    getAllArtists,
    getArtistsById,
} = require("../controllers/artistController");
const upload = require("../middlewares/upload");

const artistRouter = express.Router();

//Public routes
artistRouter.get("/", getAllArtists);
artistRouter.get("/:id", getArtistsById);

//Admin routes
artistRouter.post("/", protect, isAdmin, upload.single("image"), createArtist);

module.exports = artistRouter;
