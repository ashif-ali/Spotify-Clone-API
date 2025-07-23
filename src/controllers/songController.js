const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const Album = require("../models/Album");
const Artist = require("../models/Artist");
const Song = require("../models/Song");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

/**
 * @desc - Create a new song
 * @route - POST /api/songs
 * @Access - Private/admin
 */

const createSong = asyncHandler(async (req, res) => {
    const {title, artistId, albumId, duration, genre, isExplicit, featuredArtists} = req.body;

    //Check if artist exists
    const artist = await Artist.findById(artistId);
    if (!artist) {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Artist not found");
    }
    //Check if album exists if albumId is provided
    if(albumId) {
        const album = await Album.findById(albumId);
        if (!album) {
            res.status(StatusCodes.NOT_FOUND);
            throw new Error("Album not found");
        }
    }

    //Upload audio file
    if(!req.files || !req.files.audio) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Audio file is required");
    }
    const audioResult = await uploadToCloudinary(req.files.audio[0].path, "spotify/songs")

    //Upload cover image if provided
    let coverImageUrl = "";
    if(req.files && req.files.cover) {
        const imageResult = await uploadToCloudinary(req.files.cover, "spotify/covers")

        coverImageUrl = imageResult.secure_url;
    }
    // Create new song
    const newSong = new Song({
        title,
        artist: artistId,
        album: albumId || null,
        duration,
        genre,
        isExplicit: isExplicit || false,
        featuredArtist: featuredArtists ? JSON.parse(featuredArtists) : [],
        audioUrl: audioResult.secure_url,
        coverImage: coverImageUrl
    })

    //Save song to database
    await newSong.save();

    //Add song to artist's songs
    artist.songs.push(newSong._id);
    await artist.save();

    //add song to album if albumId is provided
    if (albumId) {
        const album = await Album.findById(albumId);
        album.songs.push(newSong._id);
        await album.save();
    }
    res.status(StatusCodes.CREATED).json({
        message: "Song created successfully",
        song: newSong,
    });
    
});

/**
 * @desc - Get all songs with filtering and pagination
 * @route - GET /api/songs
 * @Access - Public
 */

const getSongs = asyncHandler(async (req, res) => {});

/**
 * @desc - Get a song by ID
 * @route - GET /api/songs/:id
 * @Access - Public
 */

const getSongById = asyncHandler(async (req, res) => {});

/**
 * @desc - Update a song
 * @route - PUT /api/songs/:id
 * @Access - Private/admin
 */

const updateSong = asyncHandler(async (req, res) => {});

/**
 * @desc - Delete a song
 * @route - DELETE /api/songs/:id
 * @Access - Private/admin
 */

const deleteSong = asyncHandler(async (req, res) => {});

/**
 * @desc - Get top songs by plays
 * @route - GET /api/songs/top?limit=10
 * @Access - Public
 */

const getTopSongs = asyncHandler(async (req, res) => {});

/**
 * @desc - Get new releases (recently added songs)
 * @route - GET /api/songs/new-releases?limit=10
 * @Access - Public
 */
const getNewReleases = asyncHandler(async (req, res) => {});

module.exports = {
    createSong,
    getSongs,
    getSongById,
    updateSong,
    deleteSong,
    getTopSongs,
    getNewReleases,
};