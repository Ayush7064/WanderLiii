const mongoose = require("mongoose");
const Review=require("./review.js");
const listingSchema=new mongoose.Schema({
    title:String,
    description:String,
    image:{
        filename:{
            type:String,
            default:"listingimage",
        },
        url:String,
    },
    price:{
        type:Number,
        required:true,
    },
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true,
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          required: true,
          default: [0, 0],
        }
      }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=listingSchema;
module.exports=Listing;