const mysql = require('mysql2/promise');
const bluebird = require('bluebird');
var mode = "test";//test or live
const host = "localhost";
var user = "root";
var pass = "N9R#^6W1lbyS";
if(mode === "test"){
    user = "root";
    pass = "";
}
const database = "bitanis";



exports.execute = async (sql,params)=>{
    const con = await mysql.createConnection({
        host: host,
        user: user,
        password: pass,
        database: database,
        Promise: bluebird
    });
    try{
        var [result,fields] = await con.execute(sql,params);
        await con.end();
    }catch(error){
        await con.end();
        console.log("err =>",error);
    }

    return result;
}


