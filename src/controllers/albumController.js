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
        .skip(skip).populate("artist", "name image")

    res.status(StatusCodes.OK).json({
        message: "Albums fetched successfully",
        albums,
        page: parseInt(page),
        totalPages: Math.ceil(totalAlbums / parseInt(limit)),
        totalAlbums,
        
    });
});

/**
 * @desc - Get album by ID
 * @route - GET /api/albums/:id
 * @Access - Public
 */

const getAlbumById = asyncHandler(async (req, res) => {
    const album = await Album.findById(req.params.id).populate("artist", "name image bio");
    if(album) {
        res.status(StatusCodes.OK).json({
            message: "Album fetched successfully",
            album,
        });
    }else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Album not found");
    }
});


/**
 * @desc - Update an album
 * @route - PUT /api/albums/:id
 * @Access - Private/admin
 */
const updateAlbum = asyncHandler(async (req, res) => {
    const {title, releasedDate, genre, description, isExplicit} = req.body;
    const album = await Album.findById(req.params.id);
    if (!album) {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Album not found");
    }

    //update album details
    album.title = title || album.title;
    album.releasedDate = releasedDate || album.releasedDate;
    album.genre = genre || album.genre;
    album.description = description || album.description;
    album.isExplicit = isExplicit !== undefined ? isExplicit === true : album.isExplicit;

    //update image if provided
    if (req.file) {
        const result = await uploadToCloudinary(req.file.path, "spotify/albums");
        album.coverImage = result.secure_url;
    }
    //resave album
    const updatedAlbum = await album.save();
    res.status(StatusCodes.OK).json({
        message: "Album updated successfully",
        album: updatedAlbum,
    });
});

/**
 * @desc - Delete an album
 * @route - DELETE /api/albums/:id
 * @Access - Private/admin
 */
const deleteAlbum = asyncHandler(async (req, res) => {
    const album = await Album.findById(req.params.id);
    if (!album) {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Album not found");
    }

    //Remove album from artist's albums
    const artist = await Artist.findById(album.artist);
    if (artist) {
        artist.albums = artist.albums.filter(
            (a) => a.toString() !== album._id.toString()
        );
        await artist.save();
    }
// update songs to remove album reference
    await Song.updateMany(
        { album: album._id },
        { $unset: { album: 1 } }
    );

    //Delete album
    await album.deleteOne();
    res.status(StatusCodes.OK).json({
        message: "Album deleted successfully",
    });
});

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
