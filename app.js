const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const redis   = require("redis");
const session=require('express-session');
const cookieParser = require('cookie-parser');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
const busboyBodyParser=require('busboy-body-parser');

const port = 3000;

app.use(cookieParser());
app.use(bodyParser());
app.use('/views', express.static('views'));
app.set('view engine', 'ejs');
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(busboyBodyParser());

app.use(session({
    secret:"bitanisadmin session",
    cookie:{maxAge:3600000},
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
    saveUninitialized: false,
    resave: false
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Acess-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type,Accept, Authorization"
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Conrol-Allow-Methods', 'PUT, POST, PATCH , DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

 app.use((req,res,next)=>{
     if(req.session.hasLogin == undefined && req.url === "/")
     {
         req.url += "auth"
     }

     else if(req.session.hasLogin != undefined && req.url === "/")
     {
         req.url += "users"
     }
     next();
 });
const admin = require("firebase-admin");
const serviceAccount = require('./config/serviceAccountKey.json');
const appConfig = require("./config/appConfig.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:appConfig.databaseURL,
    storageBucket: appConfig.storageBucket
});

global.admin = admin;


const authRoutes=require('./routes/auth');
const usersRoutes=require('./routes/users');
const productsRoutes=require('./routes/products');
const reportsRoutes=require('./routes/reports');
const messagesRoutes=require('./routes/messages');
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/reports', reportsRoutes);
app.use('/messages', messagesRoutes);
app.use('/auth/logout',(req,res,next)=>{
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) return console.log(err);
            else{
                return res.redirect('/auth');
            }
        });
    }
});

app.get('*', function(req, res) {
    res.redirect('/');
});

app.listen(port,(err)=>{
    if(err){console.log(err)}
    else{console.log(`PORT ${port} DINLENIYOR`)}
})

module.exports=app;
