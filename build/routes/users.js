"use strict";

const express = require('express');
let router = express.Router();


app.get('/', function(req, res){
    res.send("GET request inside of" + __dirname + "users.js");
 });


module.exports = router;