const express = require('express');
var router = express.Router();
var Patient = require("../models/patient");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");

//import {Chart} from 'chart.js/auto'

router.post("/signUp", function(req,res){
    res.status(201).send("Created!");
})

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

document.addEventListener("DOMContentLoaded", ()=>{
    buildChart();
});

module.exports = router;