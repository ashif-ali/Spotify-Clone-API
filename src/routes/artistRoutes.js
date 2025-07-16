const express = require("express");
const { protect, isAdmin } = require("../middlewares/auth");
const {
    createArtist,
    getAllArtists,
    getArtistsById,
    updateArtist,
    deleteArtist,
    getTopArtists,
} = require("../controllers/artistController");
const upload = require("../middlewares/upload");

const artistRouter = express.Router();

//Public routes
artistRouter.get("/", getAllArtists);
artistRouter.get("/top", getTopArtists);
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

artistRouter.delete("/:id", protect, isAdmin, deleteArtist);

module.exports = artistRouter;
