var model = require("../models/model");
var tools = require("../functions/tools")
const fs = require('fs');

exports.messagesPage = async (req,res,next)=>{
    var handler={
        // csrfToken: req.csrfToken(),
        error:req.session.error || false,
        url: req.originalUrl,
    };
    delete req.session.error;
    return res.render('messages',handler);
};

exports.messagesList = async (req,res,next)=>{
    const db = await admin.firestore();

    let response = {
        error : "0",
        errorText:"",
        response:[]
    }
    try {
        let list = [];
        const productsRef = await db.collection("BotMessages");
        const snapshot = await  productsRef.get();
        snapshot.forEach(doc => {
            let item = doc.data();
            item.docId = doc.id;
            list.push(item);
        });
        response.response = list
        return res.send(response);
    } catch (error) {
        response.error = "1";
        response.errorText = error
        return res.send(response);
    }
}

exports.deleteMessage = async (req,res,next)=>{
    const db = await admin.firestore();

    let response = {
        error : "0",
        errorText:"",
        response:"İşlem başarılı"
    }
    try {
        const resp = await db.collection('BotMessages').doc(req.body.docId).delete();
        return res.send(response);
    } catch (error) {
        response.error = "1";
        response.errorText = error
        return res.send(response);
    }
}


exports.addMessage = async (req,res,next)=>{
    const db = await admin.firestore();

    let response = {
        error : "0",
        errorText:"",
        response:"İşlem başarılı"
    }
    try {
        let docId = tools.generateID("xxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        let item = {
            message:req.body.message
        }
        const usersRef = await db.collection("BotMessages").doc(docId).set(item);
        return res.send(response);
    } catch (error) {
        response.error = "1";
        response.errorText = error
        return res.send(response);
    }
}

exports.updateMessage = async (req,res,next)=>{
    const db = await admin.firestore();

    let response = {
        error : "0",
        errorText:"",
        response:"İşlem başarılı"
    }
    try {
        let item = {
            message:req.body.message
        }
        const productsRef = await db.collection("BotMessages").doc(req.body.docId).update(item);
        return res.send(response);
    } catch (error) {
        response.error = "1";
        response.errorText = error
        return res.send(response);
    }
}