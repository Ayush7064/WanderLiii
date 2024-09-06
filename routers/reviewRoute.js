const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review=require("../models/review");
const expressError=require("../utils/expresserror");
const ReviewController=require("../controllers/reviews");


//review Render
router.post("/",wrapAsync(ReviewController.renderReviews));
  
// delete reviews 
router.delete("/:reviewid",wrapAsync(ReviewController.deleteReview));

module.exports=router;  