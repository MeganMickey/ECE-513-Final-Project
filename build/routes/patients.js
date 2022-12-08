const express = require('express');
var router = express.Router();
var Patient = require("../models/patient");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");


// On AWS ec2, you can use to store the secret in a separate file. 
// The file should be stored outside of your code directory. 
// const fs = require('fs');
// // For encoding/decoding JWT
// const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();


router.post("/signUp", function (req, res) {

    // Seeks if user already exists in the database.
    Patient.findOne({ email: req.body.email }, function (err, patient) {

        // If the user alread exists, then the account creation fails.
        if (err) res.status(401).json({ success: false, err: err });


        else if (patient) {
            res.status(401).json({ success: false, msg: "This email already used" });
        }

        // Create the account
        else {
            // 
            const passwordHash = bcrypt.hashSync(req.body.password, 10);
            const newPatient = new Patient({
                name: req.body.name,
                email: req.body.email,
                passwordHash: passwordHash
            });

            newPatient.save(function (err, patient) {
                if (err) {
                    res.status(400).json({ success: false, err: err });
                }
                else {
                    let msgStr = `Patient account has been created. (${req.body.email})`;
                    res.status(201).json({ success: true, message: msgStr });
                    console.log(msgStr);
                }
            });
        }
    });
});



//-------------------------------------------------------------------------
// Logging in to account.
//-------------------------------------------------------------------------
router.post("/logIn", function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.status(401).json({ error: "Missing email and/or password" });
        return;
    }
    // Get user from the database
    Patient.findOne({ email: req.body.email }, function (err, patient) {
        if (err) {
            res.status(400).send(err);
        }
        else if (!patient) {
            // Username not in the database
            res.status(401).json({ error: "Login failure!!" });
        }
        else {
            if (bcrypt.compareSync(req.body.password, patient.passwordHash)) {
                const token = jwt.encode({ email: patient.email }, secret);
                //update user's last access time
                patient.lastAccess = new Date();
                patient.save((err, patient) => {
                    console.log("User's LastAccess has been updated.");
                });
                // Send back a token that contains the user's username
                res.status(201).json({ success: true, token: token, msg: "Login success" });
            }
            else {
                res.status(401).json({ success: false, msg: "Email or password invalid." });
            }
        }
    });
});





module.exports = router;