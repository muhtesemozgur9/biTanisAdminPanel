var model = require("../models/model");
var appConfig = require("../config/appConfig.json");
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
            let item = doc.data();
            item.docId= doc.id;
            usersList.push(item);
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
exports.uploadUser = async (req,res,next) =>{
    var bucket = admin.storage().bucket();
    let newImageIdKey = tools.generateID("xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx")
    let path = "views/public/"+newImageIdKey+".png";
    if(req.files.image !== undefined){
        var base64 = Buffer.from(req.files.image.data).toString('base64');
        await fs.writeFileSync(path, base64,"base64");
        console.log("here");
        const metadata = {
            metadata: {
                // This line is very important. It's to create a download token.
                firebaseStorageDownloadTokens: tools.generateID()
            },
            contentType: 'image/png',
            cacheControl: 'public, max-age=31536000',
        };
        let newFileName = "Botlar/"+newImageIdKey+".png"
        await bucket.upload(path, {
            // Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,
            metadata: metadata,
            destination: newFileName
        });
        let imageuri = "Botlar%2F"+newImageIdKey+".png";

        let imageUrl = appConfig.imageUrl+imageuri+"?alt=media"
        const db = await admin.firestore();
        let response = {
            error : "0",
            errorText:"",
            response:"İşlem başarıyla tamamlandı!"
        }
        try {
            let docId = tools.generateID("xxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            console.log("docId =>",docId)
            let item = {
                photo:imageUrl,
                id:docId,
                bot:true,
                userName:req.body.name,
                birthday:req.body.birthday,
            }
            if(req.body.foreign !== undefined && req.body.foreign !== "" && req.body.foreign !== null){
                item.foreign = (req.body.foreign === "turks" ? false:true);
            }
            if(req.body.gender !== undefined && req.body.gender !== "" && req.body.gender !== null){
                item.gender = req.body.gender;
            }
            if(req.body.marital !== undefined && req.body.marital !== "" && req.body.marital !== null){
                item.marital = req.body.marital;
            }
            if(req.body.school !== undefined && req.body.school !== "" && req.body.school !== null){
                item.school = req.body.school;
            }
            if(req.body.job !== undefined && req.body.job !== "" && req.body.job !== null){
                item.job = req.body.job;
            }
            if(req.body.bio !== undefined && req.body.bio !== "" && req.body.bio !== null){
                item.bio = req.body.bio;
            }
            if(req.body.city !== undefined && req.body.city !== "" && req.body.city !== null){
                item.city = req.body.city;
            }
            const usersRef = await db.collection("Users").doc(docId).set(item);
            return res.send(response);
        } catch (error) {
            response.error = "1";
            response.errorText = error
            return res.send(response);
        }



    }





}


exports.userMessagePage = async (req,res,next)=>{
    var handler={
        // csrfToken: req.csrfToken(),
        error:req.session.error || false,
        conversationId:req.params.docId,
        myUserId:req.params.senderId,
        receiverName:req.params.receiverName,
        url: req.originalUrl,
    };
    delete req.session.error;
    return res.render('userMessages',handler);
}
exports.userMessageListPage = async (req,res,next)=>{
    const db = await admin.firestore();
    let userList = [];
    let response = {
        error : 0,
        errorText:"",
        response:[]
    }
    try {
        let usersList = [];
        const messagesRef = await db.collection("Conversations");
        const snapshot = await  messagesRef.get();
        await snapshot.forEach( doc => {
            let item = doc.data();
            item.docId = doc.id;
            usersList.push(item);
        });
/*
        for(let a=0;a<usersList.length;a++){
            if(usersList[a].user.indexOf(req.params.docId) !== -1){
                var userName = "";
                for(let i=0;i<usersList[a].user.length;i++){
                    if(req.params.docId !== usersList[a].user[i]){
                        const db2 = await admin.firestore();
                        const userRef = await db2.collection("Users").doc(usersList[a].user[i]);
                        const doc = await userRef.get();
                        if(doc.exists){
                            let userItem = doc.data();
                            userName = userItem.userName;
                        }
                    }
                }
                usersList[a].userName = userName;
                userList.push(usersList[a]);
            }

        }

        */
    } catch (error) {
        response.error = 1;
        response.errorText = error
        return res.send(response);
    }

    var handler={
        // csrfToken: req.csrfToken(),
        error:req.session.error || false,
        myUserId:req.params.docId,
        url: req.originalUrl,
        userList:JSON.stringify(userList)
    };
    delete req.session.error;
    return res.render('userMessagesList',handler);
}
exports.userMessageListPost = async (req,res,next)=>{
    const db = await admin.firestore();
    let response = {
        error : 0,
        errorText:"",
        response:[]
    }
    try {
        let usersList = [];
        const messagesRef = await db.collection("Conversations").where("bot","==",true).where("isAnswered","==",1);
        const snapshot = await  messagesRef.get();
        await snapshot.forEach( doc => {
            let item = doc.data();
            item.docId = doc.id;
            usersList.push(item);
        });
/*
        for(let a=0;a<usersList.length;a++){
            if(usersList[a].user.indexOf(req.params.docId) !== -1){
                var userName = "";
                for(let i=0;i<usersList[a].user.length;i++){
                    if(req.params.docId !== usersList[a].user[i]){
                        const db2 = await admin.firestore();
                        const userRef = await db2.collection("Users").doc(usersList[a].user[i]);
                        const doc = await userRef.get();
                        if(doc.exists){
                            let userItem = doc.data();
                            userName = userItem.userName;
                        }
                    }
                }
                usersList[a].userName = userName;
                userList.push(usersList[a]);
            }

        }

        */
        response.response = usersList;
        return res.send(response);
    } catch (error) {
        response.error = 1;
        response.errorText = error
        return res.send(response);
    }
}

exports.userMessageList = async (req,res,next)=>{
    const db = await admin.firestore();
    let response = {
        error : "0",
        errorText:"",
        response:[]
    }
    try {
        let usersList = [];
        const messagesRef = await db.collection("Conversations/"+req.params.docId+"/mesajlar").orderBy("time","desc");
        const snapshot = await  messagesRef.get();
        await snapshot.forEach( doc => {
            let item = doc.data();
            item.docId = doc.id;
            usersList.push(item);
        });
        response.response = usersList;
        return res.send(response);
    } catch (error) {
        response.error = "1";
        response.errorText = error
        return res.send(response);
    }
}

exports.sendMessage = async (req,res,next)=>{
    const db = await admin.firestore();
    let response = {
        error : "0",
        errorText:"",
        response:[]
    }
    try {
        let usersList = [];
        let date = admin.firestore.FieldValue.serverTimestamp()
        const messagesRef = await db.collection("Conversations/"+req.body.docId+"/mesajlar").doc(tools.generateID());
        await  messagesRef.set({id:req.body.myUserId,seen:false,text:req.body.message,time:date});
        const mrf = await db.collection("Conversations").doc(req.body.docId);
        await  mrf.set({isAnswered:0});
        response.response = "success";
        return res.send(response);
    } catch (error) {
        response.error = "1";
        console.log("error =>",error)
        response.errorText = error
        return res.send(response);
    }
}

