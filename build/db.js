//------------------------------------------
// Set up mongoose connection
//------------------------------------------

// Include mongoose middleware
const mongoose = require("mongoose");

// Set up URL for the database.
const mongoDB = "mongodb://127.0.0.1/webdevelopment";

// Initiate the connection.
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Set db to the connection.
const db = mongoose.connection;

// Create an error if the database fails to set up.
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//------------------------------------------
// Finish Mongoose Connection
//------------------------------------------


module.exports = mongoose;
