const express = require('express');
var router = express.Router();
var Patient = require("../models/patient");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");



// On AWS ec2, you can use to store the secret in a separate file. 
// The file should be stored outside of your code directory. 
//const fs = require('fs');
// For encoding/decoding JWT
//const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();

// example of authentication
// register a new patient

// please fiil in the blanks
// see javascript/signup.js for ajax call
// see Figure 9.3.5: Node.js project uses token-based authentication and password hashing with bcryptjs

router.post("/signUp", function (req, res) {
    Patient.findOne({ email: req.body.email }, function (err, patient) {
        if (err) res.status(401).json({ success: false, err: err });
        else if (patient) {
            res.status(401).json({ success: false, msg: "This email already used" });
        }
        else {
            const passwordHash = bcrypt.hashSync(req.body.password, 10);
            const newPatient = new Patient({
                email: req.body.email,
                passwordHash: passwordHash
            });

            newPatient.save(function (err, patient) {
                if (err) {
                    res.status(400).json({ success: false, err: err });
                }
                else {
                    let msgStr = `Patient (${req.body.email}) account has been created.`;
                    res.status(201).json({ success: true, message: msgStr });
                    console.log(msgStr);
                }
            });
        }
    });
});




module.exports = router;