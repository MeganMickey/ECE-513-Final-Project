function logIn() {
  //--------------------------------------------------------------------------------
  // Gather Page data
  //--------------------------------------------------------------------------------
  let txdata = {
    email: $('#email').val(),
    password: $('#password').val()
  };


  //--------------------------------------------------------------------------------
  // Check if the user is logging into a physician or Patient Account.
  //--------------------------------------------------------------------------------
  var patientChecked = $("#yesPatient").is(':checked');
  let ajaxString = "";
  if (patientChecked) {
    ajaxString = "/patients";
  }
  else {
    ajaxString = "/physicians";

  }

  // window.alert(`Running ajax call to ${ajaxString} with:\n` + JSON.stringify(txdata));

  //--------------------------------------------------------------------------------
  // Create Ajax Call if verification is passed.
  //--------------------------------------------------------------------------------
  $.ajax({
    url: ajaxString + '/logIn',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(txdata),
    dataType: 'json'
  })
    .done(loginSuccess)
    .fail(loginFailure);
}


function loginSuccess(data, textStatus, jqXHR) {
  $('#rxData').html(JSON.stringify(data, null, 2));
  if (data.success) {

    // Notify user that the account has been created, redirect to login page.
    //parsedData = JSON.parse(JSON.stringify(data)); // Redundant Line
        
    window.alert(data.message);

    // Storing User's token for storage.
    localStorage.setItem('token', data.token);

    var patientChecked = $("#yesPatient").is(':checked');
    if (patientChecked) {
      setTimeout(function () {
        window.location = "patient.html";
      }, 1000);
    }
    else {
      setTimeout(function () {
        window.location = "physician.html";
      }, 1000);

    }

  }
}


function loginFailure(jqXHR, textStatus, errorThrown) {

  // Show error message to the user.
  message = JSON.parse(jqXHR.responseText);
  window.alert(`Error ${jqXHR.status}\nError Message: ${message.error}`);
  window.location = 'login.html'

}

$(function () {
  $('#sign-in-button').on("click", logIn);
});

