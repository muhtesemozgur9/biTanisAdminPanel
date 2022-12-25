$(document).ready(function (){
    $("#loginButton").on("click",function(){
        let email = $("#email").val();
        let password = $("#password").val();
        console.log("email =>",email);
        console.log("password =>",password);
        swal.fire("heey")
    })
})