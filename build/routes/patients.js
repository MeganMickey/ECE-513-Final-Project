const express = require('express');
var router = express.Router();
var Patient = require("../models/patient");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");

//import {Chart} from 'chart.js/auto'

// Get the jwt token to use for user authenication.
const secret = require('fs').readFileSync(__dirname + '/../keys/jwtkey').toString();



function buildChart(){

const data = [
    { heartRate: 112, bloodOxygen: 96 },
    { heartRate: 83, bloodOxygen: 97 },
    { heartRate: 98, bloodOxygen: 98 },
    { heartRate: 76, bloodOxygen: 102 },
    { heartRate: 136, bloodOxygen: 99 },
    { heartRate: 102, bloodOxygen: 96 },
    { heartRate: 115, bloodOxygen: 100 },
    { heartRate: 86, bloodOxygen: 96 },
    { heartRate: 83, bloodOxygen: 98 },
    { heartRate: 92, bloodOxygen: 99 },
    { heartRate: 76, bloodOxygen: 97 },
    { heartRate: 80, bloodOxygen: 96 },
];

// On AWS ec2, you can use to store the secret in a separate file. 
// The file should be stored outside of your code directory. 
const fs = require('fs');
// For encoding/decoding JWT
const secret = fs.readFileSync(__dirname + '/../jwt-key').toString();


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


new Chart($("#graph"), {
    type: 'line',
    data: {
        labels: ['6:00','6:30','7:00','7:30','8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00'],
        datasets: [
            {
                label: "Heart Rate",
                data: [data.map(row=>row.heartRate)],
                borderColor: "#3e95cd",
                fill: false
            }, {
                label: "Blood Oxygen Level",
                data: [data.map(row=>row.bloodOxygen)],
                borderColor: "#3cba9f",
                fill: false
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: 'Health Readings'
        }
    }
    });
}


//--------------------------------------------------
// Register a new Pat
//--------------------------------------------------
router.post("/signUp", function (req, res) {

    // Searching for accounts with the same email.
    Patient.findOne({ email: req.body.email }, function (err, patient) {

        // If the requrest is unauthorized, then send an error.
        if (err) res.status(401).json({ success: false, err: err });
        
        // if a phsyician account already exists with the same email.
        else if (patient) {
            res.status(401).json({ success: false, msg: "This email already used" });
        }

        // create the accounts if no errors.
        else {

            // Create a password hash to secureley store a password.
            const passwordHash = bcrypt.hashSync(req.body.password, 10);

            // Create a new physician.
            const newPhysician = new Patient({
                email: req.body.email,
                name: req.body.name,
                passwordHash: passwordHash
            });


            // Save the new physician account to the database.
            newPhysician.save(function (err, physician) {
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
