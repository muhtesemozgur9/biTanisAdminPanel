$(document).ready(function (){
    $("#loginButton").on("click",function(){
        let email = $("#email").val();
        let password = $("#password").val();
        console.log("email =>",email);
        console.log("password =>",password);
        $.post("/auth/login",{
            username:email,
            password:password
        },function(data,status){
            if(data.error === "0"){
                window.location.href = "/users";
            }
            else{
                swal.fire({
                    text: data.errorText,
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Tamam",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light-primary"
                    }
                });
            }
        })
    })
})