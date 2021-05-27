const cloudinary = require("cloudinary").v2;
// ENV
const keys = require("../config/keys");
const CLOUD_NAME = keys.cloudName;
const CLOUD_API_KEY = keys.cloudApiKey;
const CLOUD_API_SECRET = keys.cloudApiSecret;
// config
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

module.exports = cloudinary;