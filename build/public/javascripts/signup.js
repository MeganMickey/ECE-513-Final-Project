// Javascript that will run whenever the signup page is loaded.

var submitElement = document.getElementById('sign-up-button');

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
        document.getElementById("name").style.borderWidth = "2px";
        document.getElementById("name").style.borderColor = "red";

    }

    email_re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (!email_re.test(email)) {
        //window.alert("Invalid or missing email address.");
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

    error.innerHTML = errorString;
    if (errorString.length > 1) {
        error.style.display = "block";
    }
    
    if(errorString == ""){
        let txdata = {
            name: $('#name').val(),
            username: $('#email').val(),
            password: $('#password').val()
        }
        const btns = document.querySelectorAll('input[name="twoChoice"]');
        let selected;
        for(const btn of btns){
            if(btn.checked){
                selected = btn.value;
                break;
            }
        }
        if(selected == "patient"){
            $.ajax({
                url: '/patients/signUp',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(txdata),
                dataType: 'json'
            })
            .done(function (data, textStatus, jqXHR) {
                $('#formErrors').html(JSON.stringify(data, null, 2));
                if (data.success) {
                    // after 1 second, move to "login.html"
                    setTimeout(function(){
                        window.location = "login.html";
                    }, 1000);
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 404) {
                    $('#formErrors').html("Server could not be reached!!!");    
                }
                else $('#formErrors').html(JSON.stringify(jqXHR, null, 2));
            });
        }
    }

});