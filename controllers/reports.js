//productsPage
var model = require("../models/model");
var tools = require("../functions/tools")
const fs = require('fs');


exports.reportsPage = async (req,res,next)=>{
    var handler={
        // csrfToken: req.csrfToken(),
        error:req.session.error || false,
        url: req.originalUrl,
    };
    delete req.session.error;
    return res.render('reports',handler);
};

exports.reportsList = async (req,res,next)=>{
    const db = await admin.firestore();

    let response = {
        error : "0",
        errorText:"",
        response:[]
    }
    try {
        let reportsList = [];
        const reportsRef = await db.collection("Reports");
        const snapshot = await  reportsRef.get();
        let reportedUserList = [];
        let reporterUserList = [];
        snapshot.forEach(doc => {
            let item = doc.data();
            item.docId = doc.id;
            reportsList.push(item);
            reportedUserList.push(item.id);
            reporterUserList.push(item.reportedBy);
        });
        console.log("reportedUserList =>",reportedUserList)
        let usersRef = await db.collection("Users").where("id","in",reportedUserList);
        const userSnapshot = await usersRef.get();
        userSnapshot.forEach(doc =>{
            let item = doc.data();
            for(let i=0;i<reportsList.length;i++){
                if(reportsList[i].id === item.id){
                    reportsList[i].reportedUserName = item.userName
                }
            }
        })
        let reporterUserRef = await db.collection("Users").where("id","in",reporterUserList);
        const reporterUserSnapshot = await reporterUserRef.get();
        reporterUserSnapshot.forEach(doc =>{
            let item = doc.data();
            for(let i=0;i<reportsList.length;i++){
                if(reportsList[i].reportedBy === item.id){
                    reportsList[i].reporterUserName = item.userName
                }
            }
        })


        response.response = reportsList
        return res.send(response);
    } catch (error) {
        response.error = "1";
        response.errorText = error
        console.log("err",error)
        return res.send(response);
    }
}