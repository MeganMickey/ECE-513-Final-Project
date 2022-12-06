var express = require('express');
const { rawListeners } = require('../models/Reading');
var router = express.Router();
var Reading = require("../models/Reading");

//Eventually store these in the database
var start_hour = 6; //Use military time hours
var end_hour = 22;
var interval = 30; //In minutes

router.post("/timeReq", function(req, res){
  //let today = new Date();
  //let time = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
  res.status(200).json({start: start_hour, end: end_hour, time_int: interval});
});

router.post("/healthData", function(req, res){;
  console.log(req.body.hr);
  const newReading = new Reading({
    time: req.body.rdtm,
    heartRate: req.body.hr,
    bloodOxygen: req.body.spo2
  });
  newReading.save(function(err, Reading){
    if(err){
      res.status(400).send(err);
    }
    else {
      res.status(201);
    }
  });
});

module.exports = router;
