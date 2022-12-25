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
    var response;
    if(req.body.username === "devtest" && req.body.password === "123123"){
        response = {
            error:"0",
            response:"success"
        }
    }else{
        response = {
            error:"1",
            errorText:"Wrong Email or Password!"
        }
    }
    return res.send(response);
};