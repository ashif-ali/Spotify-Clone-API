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

const createAlbum = asyncHandler(async (req, res) => {});

const getAllAlbums = asyncHandler(async (req, res) => {});

const getAlbumById = asyncHandler(async (req, res) => {});

const updateAlbum = asyncHandler(async (req, res) => {});

const deleteAlbum = asyncHandler(async (req, res) => {});

const addSongToAlbum = asyncHandler(async (req, res) => {});

const removeSongFromAlbum = asyncHandler(async (req, res) => {});

const getNewReleases = asyncHandler(async (req, res) => {});

module.exports = {
    createAlbum,
    getAllAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum,
    addSongToAlbum,
    removeSongFromAlbum,
    getNewReleases,
};
