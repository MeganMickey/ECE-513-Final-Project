var express = require('express');
const { rawListeners } = require('../models/Reading');
var router = express.Router();
var Reading = require("../models/Reading");

//Eventually store these in the database
var start_hour = 06; //Use military time hours
var end_hour = 22;
var interval = 05; //In minutes

router.post("/timeReq", function(req, res){
  //let today = new Date();
  //let time = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
  console.log(interval);
  res.status(200).json({start: start_hour, end: end_hour, time_int: interval});
});

router.post("/healthData", function(req, res){
  console.log(req.body.json);
  const newReading = new Reading({
    time: req.body.json.rdtm,
    heartRate: req.body.json.hr,
    bloodOxygen: req.body.json.spo2
  });
  console.log(newReading);
  res.status(201).send("successful!");
  /*
  newReading.save(function(err, Reading){
    if(err){
      res.status(400).send("no data input");
    }
    else {
      res.status(201);
    }
  });*/
});

module.exports = router;
