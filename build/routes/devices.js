var express = require('express');
var router = express.Router();

//Eventually store these in the database
var start_hour = 6; //Use military time hours
var end_hour = 22;
var interval = 30; //In minutes

router.post("/timeReq", function(req, res){
  var today = new Date();
  var time_in_sec = (parseInt(today.getHours())*3600)+(parseInt(today.getMinutes())*60)+parseInt(today.getSeconds);
  res.status(200).json({start: start_hour, end: end_hour, time_int: interval, curr_time: time_in_sec});
})


module.exports = router;
