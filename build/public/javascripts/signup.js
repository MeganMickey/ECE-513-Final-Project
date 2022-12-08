// Javascript that will run whenever the signup page is loaded.

function signUp() {

    let name = $("#name").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let passwordConfirm = $("#passwordConfirm").val();
    let error = $("#formErrors");
    let errorString = "";


    $("#fullName").css({"borderColor": "rgb(170, 170, 170)","borderWidth": "1px"});
    $("#email").css({"borderColor": "rgb(170, 170, 170)","borderWidth": "1px"});
    $("#password").css({"borderColor": "rgb(170, 170, 170)","borderWidth": "1px"});
    $("#passwordConfirm").css({"borderColor": "rgb(170, 170, 170)","borderWidth": "1px"});


    error.css("display", "none");



    if (name.length < 1) {
        errorString += "<li>Missing full name.</li>";
        $("#name").css({"borderWidth": "2px","borderColor":"red"});
    }

    email_re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (!email_re.test(email)) {
        //window.alert("Invalid or missing email address.");
        errorString += "<li>Invalid or missing email address.</li>"
        $("#email").css({"borderWidth": "2px", "borderColor":"red"});
    }


    if (password.length < 10 || password.length > 20) {
        errorString += "<li>Password must be between 10 and 20 characters.</li>"
        $("#password").css({"borderWidth": "2px", "borderColor":"red"});
    }


    if (!/[a-z]/.test(password)) {
        errorString += "<li>Password must contain at least one lowercase character.</li>"
        $("#password").css({"borderWidth": "2px", "borderColor":"red"});
    }

    if (!/[A-Z]/.test(password)) {
        errorString += "<li>Password must contain at least one uppercase character.</li>"
        $("#password").css({"borderWidth": "2px", "borderColor":"red"});
    }

    if (!/[0-9]/.test(password)) {
        errorString += "<li>Password must contain at least one digit.</li>"
        $("#password").css({"borderWidth": "2px", "borderColor":"red"});
    }


    if (password != passwordConfirm) {
        errorString += "<li>Password and confirmation password don't match.</li>"
        $("#passwordConfirm").css({"borderWidth": "2px", "borderColor":"red"});
    }

    if (errorString.length > 1) {
        error.css("display", "block");
    }
    console.log("error string:")
    console.log(errorString.length);
    
    if(errorString.length == 0){
        console.log("No errors! Sending to server!")
        let txdata = {
            name: name,
            username: email,
            password: password
        }
        console.log(txdata);
        const btns = document.querySelectorAll('input[name="twoChoice"]');
        let selected;
        for(const btn of btns){
            if(btn.checked){
                selected = btn.value;
                break;
            }
        }
        console.log(selected);
        if(selected == "patient"){
            console.log("sending ajax request");
            /*$.post("/patients/signUp",JSON.stringify(txdata),function(data){
                console.log("successful post request");
            });*/
            $.ajax({
                url: "/patients/signUp",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(txdata),
                dataType: "json"
            })
            .done(function (data, textStatus, jqXHR) {
                console.log("send ajax request");
                $('#formErrors').html(JSON.stringify(data, null, 2));
                if (data.success) {
                    // after 1 second, move to "login.html"
                    setTimeout(function(){
                        window.location = "login.html";
                    }, 1000);
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.log("failed to post");
                if (jqXHR.status == 404) {
                    $('#formErrors').html("Server could not be reached!!!");    
                }
                
                else {error.html(JSON.stringify(jqXHR, null, 2));}
                console.log(JSON.stringify(jqXHR, null, 2));
            });
        }
    }
    else{
        error.html("<ul>"+errorString+"</ul>").css("color","white");
    }

}

$(function () {
    $("#sign-up-button").click(signUp);
})