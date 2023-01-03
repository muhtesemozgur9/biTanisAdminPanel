var model = require("../models/model");
var tools = require("../functions/tools")
const fs = require('fs');

exports.loginPage = async (req,res,next)=>{
    var handler={
        // csrfToken: req.csrfToken(),
        error:req.session.error || false,
    };
    delete req.session.error;
    return res.render('auth/login',handler);
};

exports.login = async (req,res,next)=>{
    console.log("here =>",req.session.hasLogin);
    var response;
    if(req.body.username === "devtest" && req.body.password === "123123"){
        req.session.hasLogin = "yes";
        response = {
            error:"0",
            response:"Başarılı"
        }
    }else{
        response = {
            error:"1",
            errorText:"Kullanıcı adı şifre yanlış!"
        }
    }
    return res.send(response);
};