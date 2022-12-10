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
        
        url: "patients/loadData",
        type: 'POST',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: 'json'
        
    })
        .done((data, textStatus, jqXHR) => {

            // Sends the data to a function that loada the data on to the page.
            loadPageElements(data[0])
        })
        .fail((data, textStatus, jqXHR) => {
            window.alert('Error 403: You are not logged in.\nYou must login.');
            window.location = "login.html";
        });
}



console.log();