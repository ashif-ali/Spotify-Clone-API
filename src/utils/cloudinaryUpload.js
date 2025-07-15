const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises; // Use promises for async file operations

const uploadToCloudinary = async (filePath, folder) => {
    try {
        // Validate inputs
        if (!filePath || typeof filePath !== "string") {
            throw new Error("Invalid file path");
        }
        if (!folder || typeof folder !== "string") {
            throw new Error("Invalid folder name");
        }
        // Check if file exists
        if (
            !(await fs
                .access(filePath)
                .then(() => true)
                .catch(() => false))
        ) {
            throw new Error("File does not exist");
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "auto",
        });

        // Delete the local file after successful upload
        await fs.unlink(filePath).catch((err) => {
            console.error(
                `Failed to delete local file ${filePath}:`,
                err.message
            );
        });

        return result;
    } catch (error) {
        // Log the error for debugging
        console.error("Cloudinary upload failed:", error.message);

        // Delete the local file if it exists
        try {
            await fs.unlink(filePath).catch((err) => {
                console.error(
                    `Failed to delete local file ${filePath}:`,
                    err.message
                );
            });
        } catch (err) {
            console.error("Error during cleanup:", err.message);
        }

        // Throw error with cause for better debugging
        throw new Error(`Failed to upload to Cloudinary: ${error.message}`, {
            cause: error,
        });
    }
};

module.exports = uploadToCloudinary;
