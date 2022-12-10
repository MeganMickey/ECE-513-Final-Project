// const { _ } = require('chart.js/dist/chunks/helpers.core');
var express = require('express');
const jwt = require('jwt-simple');
const fs = require('fs');
var router = express.Router();

const secret = fs.readFileSync(__dirname + '/../jwt-key').toString();


//--------------------------------------------------
// Begin Routes
//--------------------------------------------------

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/updatePassword', function (req, res, next) {

  // See if the X-Auth header is set
  if (!req.headers["x-auth"]) {
    return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
  }
  // X-Auth should contain the token 
  const token = req.headers["x-auth"];
  try {
    const decoded = jwt.decode(token, secret);
    // Send back email and last access
    Physician.find({ email: decoded.email }, "email lastAccess", function (err, users) {
      if (err) {
        res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
      }
      else {
        res.status(200).json(users);
        console.log('so far success')
      }
    });
  }
  catch (ex) {
    res.status(401).json({ success: false, message: "Invalid JWT" });
  }








});


module.exports = router;
