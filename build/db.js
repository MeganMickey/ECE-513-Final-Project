// to use mongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/webdevelopment", { useNewUrlParser: true, useUnifiedTopology:true });


module.exports = mongoose;
