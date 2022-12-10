// Setting Up router
const express = require('express');
let router = express.Router();



// Including libraries and files.
var Physician = require("../models/physician");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');

// On AWS ec2, you can use to store the secret in a separate file. 
// The file should be stored outside of your code directory. 
// For encoding/decoding JWT
const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();





//--------------------------------------------------
//--------------------------------------------------
// Begin Routes
//--------------------------------------------------
//--------------------------------------------------

//--------------------------------------------------
// Register a new Physician
//--------------------------------------------------
router.post("/signUp", function (req, res) {

    // Searching for accounts with the same email.
    Physician.findOne({ email: req.body.email }, function (err, physician) {

        // If the requrest is unauthorized, then send an error.
        if (err) res.status(401).json({ success: false, err: err });
        
        // if a phsyician account already exists with the same email.
        else if (physician) {
            res.status(401).json({ success: false, msg: "This email already used" });
        }

        // create the accounts if no errors.
        else {

            // Create a password hash to secureley store a password.
            const salt = require('fs').readFileSync(__dirname + '/../hashSalt').toString();
            saltedPass = req.body.password + salt;
            const passwordHash = bcrypt.hashSync(saltedPass, 10);
            
            // Create a new physician.
            const newPhysician = new Physician({
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
                    let msgStr = `Physician (${req.body.email}) account has been created.`;
                    res.status(201).json({ success: true, message: msgStr });
                    console.log(msgStr);
                }
            });
        }
    });
});


// // // // // // // // // /
/* Logging in to account. */
// // // // // // // // // /
router.post("/logIn", function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.status(401).json({ error: "Missing email and/or password" });
        return;
    }
    // Get user from the database
    Physician.findOne({ email: req.body.email }, function (err, physician) {
        if (err) {
            res.status(400).send(err);
        }
        else if (!physician) {
            // Username not in the database
            res.status(401).json({ error: "Login failure!!" });
        }
        else {
            const salt = require('fs').readFileSync(__dirname + '/../hashSalt').toString();
            saltedPass = req.body.password + salt;
            if (bcrypt.compareSync(saltedPass, physician.passwordHash)) {
                const token = jwt.encode({ email: physician.email, role: "physician"}, secret);
                //update user's last access time
                physician.lastAccess = new Date();
                physician.save((err, physician) => {
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


// // // // // // // // // // /
/* Checking last login time. */
// // // // // // // // // // /
router.get("/status", function (req, res) {
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
            }
        });
    }
    catch (ex) {
        res.status(401).json({ success: false, message: "Invalid JWT" });
    }
});


//---------------------------------------------------------------------------------
// This rout is called whenever the physican's patients' data must be loaded. Requires 
//--------------------------------------------------------------------------------
router.get("/loadData", function (req, res) {


    // See if the X-Auth header is set
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
    }

    // X-Auth should contain the token 
    const token = req.headers["x-auth"];
    try {

        // Reading the token.
        const decoded = jwt.decode(token, secret);

        

        // Send back email and last access
        Physician.find({ email: decoded.email }, function (err, physician) {
            if (err) {
                res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
            }
            else {
                res.status(200).json({patients: [
                    {   
                        name: "Susan",
                        readings: [
                            {
                                heartRate: 65,
                                bloodOxygen: 99,
                                time: new Date('2022-12-9T03:24:00')
                            },
                            {
                                heartRate: 73,
                                bloodOxygen: 90,
                                time: new Date('2022-12-9T03:30:00')
                            }
                        ]
                    },
                    {   
                        name: "Tom",
                        readings: [
                            {
                                heartRate: 73,
                                bloodOxygen: 98,
                                time: new Date('2022-12-9T03:24:00')
                            },
                            {
                                heartRate: 93,
                                bloodOxygen: 100,
                                time: new Date('2022-12-9T03:30:00')
                            }
                        ]
                    }
                ]
                });
            }
        });
    }
    catch (ex) {
        res.status(401).json({ success: false, message: "Invalid JWT" });
    }
});

module.exports = router;