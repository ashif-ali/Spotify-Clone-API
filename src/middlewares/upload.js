const multer = require("multer");
const path = require("path");

//configure storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

//File filter - only allow audio and image files
const fileFilter = (req, file, cb) => {
    //accept audio files (mp3, wav)
    if (file.mimetype === "audi/mpeg" || file.mimetype === "audio/wav") {
        cb(null, true);
    }
    //accept image files (jpeg, png, jpg)
    else if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Unsupported file format. Only audio or image files are allowed!",
                false
            )
        );
    }
};

//Initialize multer upload
const upload = multer({
    storage,
    limits: { fieldSize: 10 * 1024 * 1024 }, //10MB Max file size
    fileFilter,
});

module.exports = upload;
