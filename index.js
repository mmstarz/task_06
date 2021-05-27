const express = require("express");
// local imports
const connectDB = require("./mongodb/mongodb");

const PORT = process.env.PORT || 5000;

// init database
connectDB();

// init app
const app = express();

// init body parser
app.use(express.json({ limit: "5mb", extended: false }));

// init routes
app.use("/api/users", require("./routes/userRoutes"));

// environment
if (process.env.NODE_ENV === "development") {
	app.get("/", (req, res, next) => {
		res.send("API Running");
	});
}

if (process.env.NODE_ENV === "production") {
	// set static folder
	app.use(express.static("client/build"));
	// app setup
	app.get("*", (req, res, next) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`);
});
