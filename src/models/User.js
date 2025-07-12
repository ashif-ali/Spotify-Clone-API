const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password should be atleast 6 characters"],
        },
        profilePicture: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_1280.png",
        },
        isAdmin: {
            type: String,
            default: false,
        },
        likedSongs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Song",
            },
        ],
        likedAlbums: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Album",
            },
        ],
        followedArtists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Artist",
            },
        ],
        followedPlaylists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Playlist",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
