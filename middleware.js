const { model } = require("mongoose");
const Listing=require("./models/listing");
const passport=require("passport");
const User=require("./models/user.js");
module.exports.isLoggedIn=(req, res, next)=>{
    
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

/*
module.exports.isOwner= async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are notres owner of this listing");
      res.redirect(`/listings/${id}`);
    }
}
*/

