const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const Album = require("../models/Album");
const Artist = require("../models/Artist");
const Song = require("../models/Song");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

/**
 * @desc - Create a new Album
 * @route - POST /api/albums
 * @Access - Private/admin
 */

const createAlbum = asyncHandler(async (req, res) => {
    if (!req.body) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Request body is required");
    }
    const { title, artistId, releasedDate, genre, description, isExplicit } =
        req.body;

    //Validation
    if (!title || !artistId || !releasedDate || !genre || !description) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error(
            "Title, artist, released date, genre, and description are required"
        );
    }

    if (title.length < 3 || title.length > 100) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Title must be between 3 and 100 characters");
    }

    if (description.length < 10 || description.length > 200) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Description must be between 10 and 200 characters");
    }

    //Check if album already exists
    const existingAlbum = await Album.findOne({ title });
    if (existingAlbum) {
        res.status(StatusCodes.CONFLICT);
        throw new Error("Album with this title already exists");
    }

    //Check if artist exists
    const artist = await Artist.findById(artistId);
    if (!artist) {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Artist not found");
    }

    //Upload cover image to Cloudinary
    let coverImageUrl = "";
    if (req.file) {
        try {
            const uploadResult = await uploadToCloudinary(
                req.file.path,
                "spotify/albums"
            );
            coverImageUrl = uploadResult.secure_url;
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            throw new Error("Error uploading cover image to Cloudinary");
        }
    }

    //Create new album
    const album = await Album.create({
        title,
        artist: artistId,
        releasedDate: releasedDate ? new Date(releasedDate) : Date.now(),
        coverImage: coverImageUrl || undefined,
        genre,
        description,
        isExplicit: isExplicit === true,
    });

    //Add album to artist's albums
    artist.albums.push(album._id);
    await artist.save();
    res.status(StatusCodes.CREATED).json({
        message: "Album created successfully",
        album,
    });
});



/**
 * @desc - Get all albums with filtering and pagination
 * @route - GET /api/albums?genre=pop&artist=2342141343124423&search=pink&page=1&limit=10
 * @Access - Public
 */
const getAlbums = asyncHandler(async (req, res) => {
    const { genre, artist, search, page = 1, limit = 10 } = req.query;

    //Build filter object
    const filter = {};
    if (genre) {
       filter.genre = { $regex: `^${genre}$`, $options: 'i' }; // Case-insensitive match
    }
    if (artist) {
        filter.artist = artist;
    }
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            {genre: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    //Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    //Count total albums with filter
    const totalAlbums = await Album.countDocuments(filter);

    //
    const albums = await Album.find(filter)
        .sort({ releasedDate: -1 })
        .limit(limit)
        .skip(skip);

    res.status(StatusCodes.OK).json({
        message: "Albums fetched successfully",
        albums,
        page: parseInt(page),
        totalPages: Math.ceil(totalAlbums / parseInt(limit)),
        totalAlbums,
        
    });
});

const getAlbumById = asyncHandler(async (req, res) => {});

const updateAlbum = asyncHandler(async (req, res) => {});

const deleteAlbum = asyncHandler(async (req, res) => {});

const addSongsToAlbum = asyncHandler(async (req, res) => {});

const removeSongFromAlbum = asyncHandler(async (req, res) => {});

const getNewReleases = asyncHandler(async (req, res) => {});

module.exports = {
    createAlbum,
    getAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum,
    addSongsToAlbum,
    removeSongFromAlbum,
    getNewReleases,
};
