var model = require("../models/model");
var tools = require("../functions/tools")
const fs = require('fs');
const admin = require("firebase-admin");
const serviceAccount = require('../config/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bi-tanis-35f71-default-rtdb.firebaseio.com"
});



const db = admin.firestore();

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
    let response = {
        error : 0,
        errorText:"",
        response:[]
    }
    try {
        let usersList = [];
        const productsRef = db.collection("Users");
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
