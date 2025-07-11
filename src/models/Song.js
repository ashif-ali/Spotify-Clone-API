const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Song title is required"],
            trim: true,
        },

        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artist",
            required: [true, "Artist is required"],
        },

        album: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album",
        },
        duration: {
            type: Number,
            required: [true, "Song duration is required"],
        },
        audioUrl: {
            type: String,
            required: [true, "Audio url is required"],
        },
        coverImage: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2018/08/27/10/11/radio-cassette-3634616_960_720.png",
        },
        releaseDate: {
            type: Date,
            default: Date.now(),
        },

        genre: {
            type: String,
            trim: true,
        },

        plays: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        isExplicit: {
            type: Boolean,
            default: false,
        },
        featuredArtist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Artist",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
