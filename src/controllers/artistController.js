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

module.exports = { createArtist, getAllArtists };
