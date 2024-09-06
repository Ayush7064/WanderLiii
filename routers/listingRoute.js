const express=require("express");
const { model } = require("mongoose");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const {listingSchema}=require("../models/listing.js");
const Listing = require("../models/listing.js");
const passport=require("passport");
const { isLoggedIn, isOwner }=require("../middleware.js");
const review=require("../models/review.js");
const ListingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});
//index route
router.get("/", (ListingController.index));

// new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});
router.post("/new",
  isLoggedIn,
  upload.single("image"),
  wrapAsync(ListingController.newlistingform
));


// show route i.e. Read route
router.get("/:id",wrapAsync(ListingController.showlisting));

//Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(ListingController.renderEditForm));  
  //Update Route
  router.put("/:id", upload.single("listing[image]"), wrapAsync(ListingController.udapateListing));
  //Delete Route


router.delete("/:id",isLoggedIn, wrapAsync(ListingController.destroyListing));

module.exports=router;