const mongoose = require("mongoose");
// local settings
const keys = require("../config/keys");
const URI = keys.mongoURI;

// connect to database
const connectDB = async () => {
  try {
    // connect() - returns a promise
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected...");    
  } catch (err) {
    // err object have a message prop
    console.error(err.message);
    // exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;