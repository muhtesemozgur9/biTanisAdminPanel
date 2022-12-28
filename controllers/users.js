var model = require("../models/model");
var tools = require("../functions/tools")
const fs = require('fs');

exports.usersPage = async (req,res,next)=>{
    var handler={
        // csrfToken: req.csrfToken(),
        error:req.session.error || false,
        url: req.originalUrl,
    };
    delete req.session.error;
    return res.render('users',handler);
};

exports.usersList = async (req,res,next)=> {
    const db = await admin.firestore();

    let response = {
        error : 0,
        errorText:"",
        response:[]
    }
    try {
        let usersList = [];
        const productsRef = await db.collection("Users");
        const snapshot = await  productsRef.get();
        snapshot.forEach(doc => {
            usersList.push(doc.data());
        });
        response.response = usersList
        return res.send(response);
    } catch (error) {
        response.error = 1;
        response.errorText = error
        return res.send(response);
    }
}

exports.deleteUser = async (req,res,next)=> {
    const db = admin.firestore();

    let response = {
        error : "0",
        errorText:"",
        response:"İşlem başarıyla tamamlandı!"
    }
    try {
        console.log("id =>",req.body.id)
        const resp = await db.collection('Users').doc(req.body.id).delete();
        console.log("resp =>",resp);
        return res.send(response);
    } catch (error) {
        response.error = "1";
        response.errorText = error
        console.log("error =>",error)
        return res.send(response);
    }
}
