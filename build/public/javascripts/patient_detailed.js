


var curr_patient;

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
        
        url: "patients/loadData",
        type: 'POST',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: 'json'
        
    })
        .done((data, textStatus, jqXHR) => {

            // Sends the data to a function that loada the data on to the page.
            loadPageElements(data[0])
            curr_patient = data[0];
        })
        .fail((data, textStatus, jqXHR) => {
            //window.alert('Error 403: You are not logged in.\nYou must login.');
            //window.location = "login.html";
        });
}


function loadPageElements(userData)
{

    console.log(userData.readings);


    var readings = [
        {
            heartRate: 65,
            bloodOxygen: 99,
            time: new Date('2022-12-9T03:24:00')
        },
        {
            heartRate: 73,
            bloodOxygen: 90,
            time: new Date('2022-12-9T03:30:00')
        },
        {
            heartRate: 73,
            bloodOxygen: 98,
            time: new Date('2022-12-9T03:24:00')
        },
        {
            heartRate: 93,
            bloodOxygen: 100,
            time: new Date('2022-12-9T03:30:00')
        }
    ];
    
    var times = ["4:00", "4:30", "5:00", "5:30"];
    var blood = [];
    var heart = [];
    for (var read of readings){
        //times.push(read.time.getHour+":"+read.time.getMinute);
        blood.push(read.bloodOxygen);
        heart.push(read.heartRate);
    }
    console.log(times);

    new Chart($("#graph"), {
        type: 'line',
        data: {
            labels: times,
            datasets: [
                {
                    label: "Heart Rate",
                    data: heart,
                    borderColor: "#3e95cd",
                    fill: false
                }, {
                    label: "Blood Oxygen Level",
                    data: blood,
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
}