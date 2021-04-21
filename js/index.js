
$(document).ready(function () {


    let session = {};

    session = JSON.parse(sessionStorage.getItem('SessionCP'));

    if (session == undefined || session == null) {

        if (document.title == "Panaderia Nani") {

            console.log(document.title); 

            sessionStorage.setItem('SessionCP', JSON.stringify(null));
            window.location.href = "pages/login.html";
        }
        else {

            sessionStorage.setItem('SessionCP', JSON.stringify(null));
            window.location.href = "login.html";
        }
        
    }


});


function CerrarSesion(url) {

    sessionStorage.setItem('SessionCP', JSON.stringify(null));

    window.location.href = url;
}

