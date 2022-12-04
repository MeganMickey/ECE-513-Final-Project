var express = require('express');
var router = express.Router();

//Eventually store these in the database
var start_hour = 6; //Use military time hours
var end_hour = 22;
var interval = 30; //In minutes

router("/timeReq", function(req, res){
  res.status(200).json({start: start_hour, end: end_hour, time_int: interval});
})


module.exports = router;
