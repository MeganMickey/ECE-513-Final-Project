function signUp() {

    //--------------------------------------------------------------------------------
    // Checking if patient or physician.
    //--------------------------------------------------------------------------------


    let ajaxString = "";
    if ($("#yesPatient").is(':checked')) {
        ajaxString = "/patients";
    }
    else if ($("#yesPhysician").is(':checked')) {
        ajaxString = "/physicians";

    }
    else {
        window.alert("You must register to be a Patient or Physician");
        return;
    }

    //--------------------------------------------------------------------------------
    // Name Validation
    //--------------------------------------------------------------------------------
    if (/[0-9]/.test($('#name').val()) || $('#name').val().length == 0) {
        window.alert("invalid name!");
        return;
    }


    //--------------------------------------------------------------------------------
    // Email Validation
    //--------------------------------------------------------------------------------
    email_re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (!email_re.test($('#email').val())) {
        window.alert("invalid email!");
        return;
    }

    //--------------------------------------------------------------------------------
    // Password Validation
    //--------------------------------------------------------------------------------

    let password = $('#password').val();
    if (password.length < 10 || password.length > 20) {
        window.alert("Password must be between 10 and 20 characters.");
        return;
    }
    if (!/[a-z]/.test(password)) {
        window.alert("Password must contain at least one lowercase character.");
        return;
    }
    if (!/[A-z]/.test(password)) {
        window.alert("Password must contain at least one uppercase character.");
        return;
    }

    if (!/[0-9]/.test(password)) {
        window.alert("Password must contain at least one digit.");
        return;
    }

    let passwordConfirm = $("#password-check").val();
    if (password === passwordConfirm) {
        window.alert("Passwords do not match.");
        return;
    }




    //--------------------------------------------------------------------------------
    // Create Ajax Call if verification is passed.
    //--------------------------------------------------------------------------------

    let txdata = {
        name: $('#name').val(),
        email: $('#email').val(),
        deviceID: $("#device-id").val(),
        password: $('#password').val(),
        passwordConfirm: $("#passwordConfirm").val()
    };

    window.alert('Ajex call being made with:\n' + JSON.stringify(txdata));

    $.ajax({
        url: routeUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
        .done(registerSuccess)
        .fail(registerFailure);
}



function registerSuccess(data, textStatus, jqXHR) {
    $('#rxData').html(JSON.stringify(data, null, 2));
    if (data.success) {
        // after 1 second, move to "login.html"
        setTimeout(function () {
            window.location = "login.html";
        }, 100);
    }
}

function registerFailure(jqXHR, textStatus, errorThrown) {
    if (jqXHR.status == 404) {
        $('#rxData').html("Server could not be reached!!!");
    }
    else $('#rxData').html(JSON.stringify(jqXHR, null, 2));
}



$(function () {
    $('#sign-up-button').on("click", signUp);
});

