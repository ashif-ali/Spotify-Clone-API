const express = require("express");
const { protect, isAdmin } = require("../middlewares/auth");
const {
    createArtist,
    getAllArtists,
    getArtistsById,
    updateArtist,
} = require("../controllers/artistController");
const upload = require("../middlewares/upload");

const artistRouter = express.Router();

//Public routes
artistRouter.get("/", getAllArtists);
artistRouter.get("/:id", getArtistsById);

//Admin routes
artistRouter.post("/", protect, isAdmin, upload.single("image"), createArtist);

artistRouter.put(
    "/:id",
    protect,
    isAdmin,
    upload.single("image"),
    updateArtist
);

module.exports = artistRouter;
