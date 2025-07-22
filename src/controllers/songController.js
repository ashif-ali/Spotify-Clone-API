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

const createSong = asyncHandler(async (req, res) => {});

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