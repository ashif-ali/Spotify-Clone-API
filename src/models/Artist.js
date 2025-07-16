const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Artist name is required"],
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },

        image: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2024/03/05/11/31/ai-generated-8614400_960_720.jpg",
        },
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Song",
            },
        ],
        genre: [
            {
                type: String,
                ref: "Song",
            },
        ],
        followers: {
            type: Number,
            default: 0,
        },
        albums: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Album",
            },
        ],
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Song",
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;
