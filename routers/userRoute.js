const express=require("express");
const router=express.Router();
const User=require("../models/user");
const asyncWrap=require("../utils/wrapAsync");
const passport=require("passport");
const ExpressError=require("../utils/expresserror");
const { saveRedirectUrl }=require("../middleware");

router.get("/signup",(req,res)=>{
    res.render("../views/users/signupform.ejs");
});
router.post("/signup",asyncWrap(async(req,res)=>{
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const regUser=await User.register(newUser,password);
    console.log(regUser);
    req.login(regUser,(err)=>{
        if(err){
            next();
        }
        req.flash("success","Welcome to the WanderLust");
        res.redirect("/listings");
    })
    
}));

router.get("/login",async(req,res)=>{
    res.render("../views/users/loginForm.ejs");
});
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),
    async(req,res)=>{
    req.flash("success","Welcome back ,You are loged in!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res)=>{
    req.logout(()=>{

        req.flash("success","You are logged Out!");
        res.redirect("/listings");
    });
    
});

module.exports=router;
