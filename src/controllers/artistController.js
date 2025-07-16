const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const Artist = require("../models/Artist");
const Song = require("../models/Song");
const Album = require("../models/Album");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

/**
 * @desc - Create a new Artist
 * @route - POST /api/artists
 * @Access - Private
 */
const createArtist = asyncHandler(async (req, res) => {
    // Validate request body
    if (!req.body) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Request body is required");
    }

    const { name, bio, genre } = req.body;

    if (!name || !bio || !genre) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Name, bio, and genres are required");
    }

    const artistExists = await Artist.findOne({ name });
    if (artistExists) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Artist already exists");
    }

    let imageUrl = "";
    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.path,
            "spotify/artists"
        );
        imageUrl = result.secure_url;
    }

    // Create the artist
    const artist = await Artist.create({
        name,
        bio,
        isVerified: true,
        image: imageUrl || Artist.schema.path("image").defaultValue,
        genre: genre ? genre.split(",").map((g) => g.trim()) : [],
    });

    res.status(StatusCodes.CREATED).json(artist);
});

/**
 * @desc - Get all artists with filtering and pagination
 * @route - GET /api/artists?genre=pop&search=pink&page=1&limit=10
 * @Access - Public
 */

const getAllArtists = asyncHandler(async (req, res) => {
    //console.log(req.query);
    const { genre, search, page = 1, limit = 10 } = req.query;
    //Build filter object
    const filter = {};
    if (genre) {
        filter.genres = { $in: [genre] };
    }
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { bio: { $regex: search, $options: "i" } },
        ];
    }

    //Count total artists with filter
    const count = await Artist.countDocuments(filter);

    //Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    //Get artists
    const artists = await Artist.find(filter)
        .sort({ followers: -1 })
        .limit(parseInt(limit))
        .skip(skip);

    res.status(StatusCodes.OK).json({
        success: true,
        artists,
        page: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
        totalArtists: count,
    });
});

/**
 *! @desc - Get artist by ID
 * @route - GET /api/artists/:id
 * @Access - Public
 */
const getArtistsById = asyncHandler(async (req, res) => {
    //console.log(req.params.id);
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Artist not found");
    } else {
        res.status(StatusCodes.OK).json(artist);
    }
});

/**
 * @desc - Update artist details
 * @route - PUT /api/artists/:id
 * @Access - Private (Admin)
 */
const updateArtist = asyncHandler(async (req, res) => {
    const { name, bio, genre, isVerified } = req.body;

    // Validate request body
    if (!name || !bio || !genre) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Name, bio, and genres are required");
    }

    const artist = await Artist.findById(req.params.id);
    if (!artist) {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Artist not found");
    }

    // Update artist details
    artist.name = name || artist.name;
    artist.bio = bio || artist.bio;
    artist.genre = genre.split(",").map((g) => g.trim()) || artist.genre;
    artist.isVerified =
        isVerified !== undefined ? isVerified === true : artist.isVerified;

    // update image if provided
    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.path,
            "spotify/artists"
        );
        artist.image = result.secure_url;
    }

    //reSave
    const updatedArtist = await artist.save();
    res.status(StatusCodes.OK).json(updatedArtist);
});

/**
 * @desc - Delete artist
 * @route - DELETE /api/artists/:id
 * @Access - Private (Admin)
 */
const deleteArtist = asyncHandler(async (req, res) => {
    //console.log("delete artist");
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Artist not found");
    }

    // Delete all songs associated with the artist
    await Song.deleteMany({ artist: artist._id });
    // Delete all albums associated with the artist
    await Album.deleteMany({ artist: artist._id });

    // Delete the artist
    await artist.deleteOne();
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Artist deleted successfully",
    });
});

module.exports = {
    createArtist,
    getAllArtists,
    getArtistsById,
    updateArtist,
    deleteArtist,
};
