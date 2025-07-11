const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Playlist title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        coverImage: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2014/04/02/14/04/vinyl-306070_1280.png",
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Creator name is required"],
        },
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Song",
            },
        ],
        isPublic: {
            type: boolean,
            default: false,
        },
        followers: {
            type: Number,
            default: 0,
        },
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
