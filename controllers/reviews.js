const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.renderReviews=async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let listing = await Listing.findById(req.params.id);
    
      let newReview=new Review(req.body.review);
     // console.log(listing);
      //console.log(newReview);
     // newReview.author=req.user._id;
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      console.log(newReview);
      console.log(listing.reviews);
      req.flash("success","New View Added!!");
      res.redirect(`/listings/${listing._id}`);
    };

module.exports.deleteReview=async(req,res)=>{
    let{id,reviewid}=req.params;
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","review deleted!!");
    res.redirect(`/listings/${id}`);
      
}