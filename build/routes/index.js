"use strict";

var express = require('express');
var app = express();

app.get('/', function(req, res){
   res.send("GET request inside of" + __dirname + "index.js");
});

app.listen(3000);