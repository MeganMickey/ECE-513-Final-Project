function sendSigninRequest() {
    let email = $('#email').val();
    let password = $('#password').val();
  
    $.ajax({
      url: '/users/signin',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email : email, password : password }),
      dataType: 'json'
    })
    .done(signinSuccess)
    .fail(signinError);
  }
  
  function signInWithGoogle(email, name, id) {
  
    // attempt to sign in
    $.ajax({
      url: '/users/signin',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email : email, password : id }),
      dataType: 'json'
    })
    // redirect to dashboard if signin was successful
    .done(signinSuccess)
    // register if not in database
    .fail(function (jqXHR, textStatus, errorThrown) {
      $.ajax({
       url: '/users/register',
       type: 'POST',
       contentType: 'application/json',
       data: JSON.stringify({email:email, fullName:name, password:id}),
       dataType: 'json'
      })
      // sign in if registration worked
      .done(
        $.ajax({
          url: '/users/signin',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ email : email, password : id }),
          dataType: 'json'
        })
        //redirect to dashboard if signin was successful
        .done(signinSuccess)
        //show error if sign in failed
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus)
        })
      )
      //show error if registration failed
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus)
      })
    });
  }
  
  function signinSuccess(data, textStatus, jqXHR) {
    window.localStorage.setItem('authToken', data.authToken);
    window.location = "dashboard.html";
  }
  
  function signinError(jqXHR, textStatus, errorThrown) {
    if (jqXHR.statusCode == 404) {
      $('#ServerResponse').html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
      $('#ServerResponse').show();
    }
    else {
      $('#ServerResponse').html("<span class='red-text text-darken-2'>Error: " + jqXHR.responseJSON.message + "</span>");
      $('#ServerResponse').show();
    }
  }
  
  // Handle authentication on page load
  $(function() {
    if( window.localStorage.getItem('authToken')) {
      window.location.replace('dashboard.html');
    }
    else {
      $('#signin').click(sendSigninRequest);
       $('#password').keypress(function(event) {
          if( event.which === 13 ) {
             sendSigninRequest();
          }
       });
    }
  });
  