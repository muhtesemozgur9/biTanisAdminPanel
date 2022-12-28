//productsPage
var model = require("../models/model");
var tools = require("../functions/tools")
const fs = require('fs');


exports.productsPage = async (req,res,next)=>{
    var handler={
        // csrfToken: req.csrfToken(),
        error:req.session.error || false,
        url: req.originalUrl,
    };
    delete req.session.error;
    return res.render('products',handler);
};

exports.productsList = async (req,res,next)=>{
    const db = await admin.firestore();

    let response = {
        error : 0,
        errorText:"",
        response:[]
    }
    try {
        let productList = [];
        const productsRef = await db.collection("Products");
        const snapshot = await  productsRef.get();
        snapshot.forEach(doc => {
            let item = doc.data();
            item.docId = doc.id;
            productList.push(item);
        });
        response.response = productList
        return res.send(response);
    } catch (error) {
        response.error = 1;
        response.errorText = error
        return res.send(response);
    }
}

exports.updateProduct = async (req,res,next)=>{
    const db = await admin.firestore();

    let response = {
        error : "0",
        errorText:"",
        response:"İşlem başarıyla tamamlandı!"
    }
    try {
        const productsRef = await db.collection("Products").doc(req.body.docId).update({foreign:(req.body.updateForeign === "turks" ? false:true),productID:req.body.updateProductID});
        return res.send(response);
    } catch (error) {
        response.error = "1";
        response.errorText = error
        return res.send(response);
    }
}
exports.addProduct = async (req,res,next)=>{
    const db = await admin.firestore();

    let response = {
        error : "0",
        errorText:"",
        response:"İşlem başarıyla tamamlandı!"
    }
    try {
        let docId = tools.generateID();
        const productsRef = await db.collection("Products").doc(docId).set({foreign:(req.body.foreign === "turks" ? false:true),productID:req.body.productID});
        return res.send(response);
    } catch (error) {
        response.error = "1";
        response.errorText = error
        return res.send(response);
    }
}
