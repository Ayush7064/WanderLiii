require('dotenv').config()
console.log(process.env.SECRET_kEY) 

const express=require("express");
const app=express();
const port=8080;
const mongoose = require('mongoose');
const path=require("path");
const methodOverride = require("method-override");
const ejsmate=require("ejs-mate");
const {listingSchema}=require("./models/listing.js");
const listingRoute=require("./routers/listingRoute.js");
const reviewRoute=require("./routers/reviewRoute.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRoute=require("./routers/userRoute");
const ExpressError=require("./utils/expresserror.js");
const { render } = require('ejs');



app.use(express.static(path.join(__dirname, "public")));
const sessionOptions={
    secret:"mysecretcode",
    resave:"false",
    saveUninitialized:"false",
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const urlDb= process.env.ATAS_DB;
main().then(()=>{
        console.log("Connection is established");
    })
    .catch((err)=>{
        console.log(err);
    })
async function main(){
    mongoose.connect(urlDb);
}
app.set("view engine","ejs");
app.set(path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);


app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser=req.user;
    next();
});


// demouser
app.get("/demouser",async(req,res)=>{
    let fakeuser=new User({
        email:"ayushkasera@7046",
        username:"Ayush Kasera",
    });
   let registeredUser= await User.register(fakeuser,"helloworld");
   res.send(registeredUser);
});
app.get("/",(req,res)=>{
    res.redirect("/listings");
})
//listings route
app.use("/listings",listingRoute);

// review route
app.use("/listings/:id/reviews",reviewRoute);
// user route
app.use("/",userRoute);
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
  let{status=500,message="Something went wrong"}=err;
  res.render("listings/error.ejs",{err});
  //res.send(message, status);
});
app.listen(port,()=>{
    console.log(`app is listening on the port ${port}`);
});