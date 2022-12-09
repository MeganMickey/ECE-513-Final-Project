window.alert("testing loading js");

//------------------------------------------------------------------------------------------------
// As soon as the window loads, check if the user is logged in.
//------------------------------------------------------------------------------------------------
$.ajax({

    url: "patient/logIn",
    type: 'GET',
    contentType: 'application/json',
    dataType: 'json'
}).done(loginSuccess).fail(loginFailure);

function loginSuccess()
{

}

function loginSuccess()
{
    
}


