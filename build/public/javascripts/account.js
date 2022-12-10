//------------------------------------------------------------------------------------------------------------------------
// Global Variables
//------------------------------------------------------------------------------------------------------------------------
var userData;

var isPatient = window.localStorage.getItem('token');

console.log("Token:\n" + isPatient);




addEventListener("load", () => {

    validateToken();


});


//------------------------------------------------------------------------------------------------------------------------
// 
//------------------------------------------------------------------------------------------------------------------------
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

        url: "patients/loadData",
        type: 'POST',
        method: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("token") },
        dataType: 'json'

    })
        .done((data, textStatus, jqXHR) => {

            // Aqcuires the user data.
            userData = data[0];
            loadPageElements();


        })
        .fail((data, textStatus, jqXHR) => {
            window.alert('Error 403: You are not logged in.\nYou must login.');
            window.location = "login.html";
        });
}



function loadPageElements() {


    $("#name").val(userData.name);
    $("#physician-select").val(userData.physician);
    $("#device-id").val(userData.deviceId);
    $("#email").val(userData.email);
    $("#password")


}




$(function () {
    $('#update-button').on("click", updatePatient);
});


//------------------------------------------------------------------------------------------------------------------------
// This function checks if any of the parameters inside the user's info have changed and updates them accordingly.
//------------------------------------------------------------------------------------------------------------------------
function updatePatient() {



    let filledInDeviceId = $("#device-id").val();
    let filledInPhysician = $("#physician-select").val();
    let filledInEmail = $("#email").val();
    let filledInNewPassword = $("#new-password").val();


    // If the Physicians don't match, then update the Physician
    // If the devices don't match, then update the device.
    if (!(filledInDeviceId === userData.deviceId) && $("#device-id").val() != "") {
        console.log('Updating Device');
        updateDevice();
    }
    // else if (!(filledInPhysician == userData.physician) && $("#physician-select").val != "") {
    //     console.log('Updating Physician');
    //     updatePhsyician();
    // }
    // If the emails don't match, then update the email
    else if (!(filledInEmail === userData.email) && $("#email").val != "") {
        updateEmail();
    }
    // // If the names don't match, then update name
    // else if (!(userData.name === ($("#name").val())) && $("#physician-select").val != "") {
    //     console.log('Updating Updating Name');
    //     updateName();
    // }
    else if (filledInNewPassword != "") {

        let nonMatchingPasswords = !($("#new-password").val() === $("#repeat-password").val());
        if (nonMatchingPasswords) {
            window.alert('New Passwords Must Match in order to change password.')
        }

        updatePassword();

    }



}

function updatePhsyician() {

}

function updateDevice() {


    deviceID = $("#device-id").val()


    let txdata = {
        deviceId: $("#device-id").val(),
        name: userData.name
    };

    console.log("Changing Device Id to: " + deviceID);

    $.ajax({
        url: '/patients/updateDevice',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
        .done(function (data, textStatus, jqXHR) {
            console.log('update device rout sucessful');
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log('update device route unsuccessful.');
        });


}

function updateEmail() {

}

function updateName() {

}

function updatePassword() {

    txdata = {
        email: userData.email,
        currentPassword: $("#old-password").val(),
        newPassword: $("#new-password").val(),
        repeatPassword: $("#repeat-password").val(),
        token: localStorage.getItem('token')

    };


    $.ajax({
        url: '/users/updatePassword',
        method: 'POST',
        contentType: 'application/json',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
        .done(function (data, textStatus, jqXHR) {
            console.log('password Sucessfully changed.');
        })
        .fail(function (data, textStatus, jqXHR) {
            console.log('password not changed.');
        });
}





