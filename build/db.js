// to use mongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:3000/webdevelopment", { useNewUrlParser: true, useUnifiedTopology:true });


module.exports = mongoose;
