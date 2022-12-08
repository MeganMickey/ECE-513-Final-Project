var express = require('express');
const { rawListeners } = require('../models/Reading');
var router = express.Router();
var Reading = require("../models/Reading");
var Patient = require("../models/Patient");

//Eventually store these in the database
var start_hour = 6; //Use military time hours
var end_hour = 22;
var interval = 5; //In minutes

router.post("/timeReq", function(req, res){
  //let today = new Date();
  //let time = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
  var edit_start_hour = ""+start_hour;
  var edit_end_hour = ""+end_hour;
  var edit_interval = ""+interval;
  if(start_hour < 10){
    edit_start_hour = "0"+start_hour;
  }
  if(interval < 10){
    edit_interval = "0"+interval;
  }
  if(end_hour < 10){
    edit_end_hour = "0"+end_hour;
  }
  res.status(200).json({start: edit_start_hour, end: edit_end_hour, time_int: edit_interval});
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
  newReading.save(function(err, Reading){
    if(err){
      console.log(err);
      res.status(400).send(err);
    }
    else {
      res.status(201);
    }
  });
});

module.exports = router;
