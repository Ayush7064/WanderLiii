const Listing=require("../models/listing");
const review=require("../models/review");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MY_ACCESS_TOKEN=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }
module.exports.newlistingform=async (req, res,next) => {
  let response=await geocodingClient.forwardGeocode({
    query: req.body.location,
    limit: 1
  })
    .send();
    console.log(response.body.features[0].geometry.type);
    console.log(response.body.features[0].geometry.coordinates);



    let newtitle=req.body.title;
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url ,"..",filename );
    const newListing = new Listing(req.body);
    newListing.owner=req.user._id;
    await newListing.save();
    const Geometry = response.body.features[0].geometry;
    const updatedDoc = await Listing.findOneAndUpdate(
        { title: newtitle

         }, // Filter to find the document by title
        {
          $set: {
            "image.url":url,
            "image.filename":filename ,// Update the URL
            "geometry.type":Geometry.type,
            "geometry.coordinates":Geometry.coordinates,
          }
        },
        { new: true, runValidators: true } // Options to return the updated document and run validators
      );

      console.log(updatedDoc);
      //updatedDoc.geometry=response.body.features[0].geometry;
      req.flash("success","New listing Created!!");
      res.redirect("/listings");
      console.log(req.body);
  };

module.exports.showlisting=async(req,res)=>{
    let { id }=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
      req.flash("error","The listing you are search for does not exits!!");
      res.redirect("/listings");
    } 
    console.log(review.author);
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    

    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload/","/uplaod/w_300");
    console.log(originalUrl);
    res.render("listings/edit.ejs", { listing ,originalUrl});


  }

module.exports.udapateListing=async (req, res) => {
    let { id } = req.params;
   
    console.log(req.body);
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !=="undefined"){
      let url=req.file.path;
      let filename=req.body.filename;
      const updatedDoc = await Listing.findOneAndUpdate(
        { title: listing.title

         }, // Filter to find the document by title
        {
          $set: {
            "image.url":req.file.path,
            "image.filename":req.body.filename, // Update the URL
          }
        },
        { new: true, runValidators: true } // Options to return the updated document and run validators
      );
      console.log(updatedDoc);
    }
    console.log(listing);
    req.flash("success","Listing Edited!!");
    res.redirect(`/listings/${id}`);
  };
  module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");
  }