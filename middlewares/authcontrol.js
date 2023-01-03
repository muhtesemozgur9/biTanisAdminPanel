exports.auth_control=async (req,res,next)=>{
    console.log("hasLogin =>",req.session.hasLogin)
    if(req.session.hasLogin === undefined || req.session.hasLogin === "" || req.session.hasLogin === null){
        res.redirect('/auth');
    }else{
        next();
    }
}