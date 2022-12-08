const express = require('express');
let router = express.Router();

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