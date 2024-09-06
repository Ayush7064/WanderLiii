const mongoose = require('mongoose');
const Listing=require("../models/listing");
const Review=require("../models/review");
const initData=require("./data");
require('dotenv').config()


main().then(()=>{
        console.log("Connection is established");
    })
    .catch((err)=>{
        console.log(err);
    })
async function main(){
    mongoose.connect("mongodb+srv://ayushkasera7064:Mr4CtXBS28OHuMl3@cluster0.xtvw5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}
const initDb = async () => {
    // Create a new array with the owner information added to each object
    const modifiedData = initData.data.map((obj) => ({ ...obj, owner: "66db6ed18a605be701a7770d" }));

    // Insert the modified data into the database
    await Listing.insertMany(modifiedData);

    console.log("Successful!");
};

initDb();


const initreiew=async()=>{
    let data=await Review.insertMany({rating:3,comment:"good experience"});
    console.log(data);
}
initreiew();