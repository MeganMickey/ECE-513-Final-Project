//const validate = require("../../models/patient");
//const express = require('express');

var patients_data;

//------------------------------------------------------------------------------------------------
// As soon as the window loads, check if the user is logged in.
//------------------------------------------------------------------------------------------------
addEventListener("load", () => {

    validateToken();


});


function validateToken() {


    // Collects the user token the user token. If the token cannot be loaded, then the user is redirected to the login page.
    try {
        var token = localStorage.getItem('token');

    } catch (error) {
        window.alert("Login token could not be loaded, Please log in again.");
        window.location = 'login.html';
    }

    
    // Makes Ajax call to see if user is logged in.
      $.ajax({
        
        url: "physicians/loadData",
        type: 'POST',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: 'json'
        
    })
        .done((data, textStatus, jqXHR) => {

            // Sends the data to a function that loada the data on to the page.

            patients_data = data.patients;
            loadPageElements(data.patients);
        })
            
        .fail((data, textStatus, jqXHR) => {
            window.alert('Error 403: You are not logged in.\nYou must login.');
            window.location = "login.html";
        });
}

function loadPageElements(patients)
{
    for (var patient of patients){
        $("#patient-name").append('<option value="'+patient.name+'">'+patient.name+'</option>');
    }
}

$("#patient-button").on("click", function(){
        click.preventDefault();
        var selected = $("#patient-name").val();
        console.log(selected);
        var patient_index;
        var i = 0;
        for (var pat of patients){
            if(pat.name == selected){
                patient_index = i;
            }
            else {
                i++;
            }
        }

        $("#physician-header > h1 ").text(selected+"'s Weekly Summary");
        $("#physician-header > p ").text(selected+"'s average, maxmimum, and minimum heart rate for the past seven days is displayed below.");
        
        
        window.location = "physician_detailedview.html";
        

        var readings = patients[patient_index].readings;
        console.log(readings);
        new Chart($("#graph"), {
            type: 'line',
            data: {
                labels: [readings.time.map(row => row.times)],
                datasets: [
                    {
                        label: "Heart Rate",
                        data: [readings.map(row => row.heartRate)],
                        borderColor: "#3e95cd",
                        fill: false
                    }, {
                        label: "Blood Oxygen Level",
                        data: [readings.map(row => row.bloodOxygen)],
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

});


