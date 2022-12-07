// Javascript that will run whenever the signup page is loaded.

// Notify console that the script is loaded.
console.log('window.onload: javascript/signup.js');

// Populating the html with jQuery library.
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);





let registerForm = document.querySelectorAll(".register-form");

console.log(registerForm);


// var arr = [].slice.call(submitElement);
// console.log(arr);


//let form = document.getElementsByClassName('register-form-content').getElementById('name');


//console.log(form);



/*
submitElement.addEventListener("click", function () {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let passwordConfirm = document.getElementById("passwordConfirm").value;
    let error = document.getElementById("formErrors");

    let errorString = "";


    document.getElementById("fullName").style.borderColor = "rgb(170, 170, 170)";
    document.getElementById("fullName").style.borderWidth = "1px";
    document.getElementById("email").style.borderColor = "rgb(170, 170, 170)";
    document.getElementById("email").style.borderWidth = "1px";
    document.getElementById("password").style.borderColor = "rgb(170, 170, 170)";
    document.getElementById("password").style.borderWidth = "1px";
    document.getElementById("passwordConfirm").style.borderColor = "rgb(170, 170, 170)";
    document.getElementById("passwordConfirm").style.borderWidth = "1px";


    error.style.display = "none";



    if (name.length < 1) {
        errorString += "<li>Missing full name.</li>";
        document.getElementById("fullName").style.borderWidth = "2px";
        document.getElementById("fullName").style.borderColor = "red";

    }

    email_re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (!email_re.test(email)) {
        errorString += "<li>Invalid or missing email address.</li>"
        document.getElementById("email").style.borderWidth = "2px";
        document.getElementById("email").style.borderColor = "red";
    }


    if (password.length < 10 || password.length > 20) {
        errorString += "<li>Password must be between 10 and 20 characters.</li>"
        document.getElementById("password").style.borderWidth = "2px";
        document.getElementById("password").style.borderColor = "red";
    }


    if (!/[a-z]/.test(password)) {
        errorString += "<li>Password must contain at least one lowercase character.</li>"
        document.getElementById("password").style.borderWidth = "2px";
        document.getElementById("password").style.borderColor = "red";
    }

    if (!/[A-Z]/.test(password)) {
        errorString += "<li>Password must contain at least one uppercase character.</li>"
        document.getElementById("password").style.borderWidth = "2px";
        document.getElementById("password").style.borderColor = "red";
    }

    if (!/[0-9]/.test(password)) {
        errorString += "<li>Password must contain at least one digit.</li>"
        document.getElementById("password").style.borderWidth = "2px";
        document.getElementById("password").style.borderColor = "red";
    }


    if (password != passwordConfirm) {
        errorString += "<li>Password and confirmation password don't match.</li>"
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("passwordConfirm").style.borderColor = "red";
        document.getElementById("password").style.borderWidth = "2px";
        document.getElementById("passwordConfirm").style.borderWidth = "2px";
    }

    error.innerHTML = "<ul>" + errorString + "</ul>";
    if (errorString.length > 1) {
        error.style.display = "block";
    }

});
*/