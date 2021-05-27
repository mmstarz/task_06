const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// env
const keys = require("../config/keys");
// cloudinary
const cloudinary = require("../utils/cloudinary");

const CLOUD_AVATARS_FOLDER = keys.cloudAvatarsFolder;

// types:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array
// Decimal128
// Map
// Schema

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        avatar: {
            id: {
                type: String,
                default: "",
            },
            url: {
                type: String,
                default: "",
            },
        },
    },
    { timestamps: true }
);

// user remove
UserSchema.post("findOneAndRemove", async (doc) => {
    // console.log("findOneAndRemove - User");
    // console.log("user remove doc: ", doc);

    try {
        // remove avatar if exists
        if (doc.avatar.id.length > 0 && doc.avatar.url.length > 0) {
            await cloudinary.uploader.destroy(doc.avatar.id);
        }

        // form folder path
        const folder = CLOUD_AVATARS_FOLDER + "/" + doc._id;
        // remove user folder from cloudinary
        await cloudinary.api.delete_folder(folder);

        return;
    } catch (err) {
        return new Error(
            "Internal server error (UserSchema.post('findOneAndRemove'))"
        );
    }
});

module.exports = User = mongoose.model("User", UserSchema);
