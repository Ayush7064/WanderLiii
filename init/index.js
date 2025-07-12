const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Listing=require("../models/listing");
const Review=require("../models/review");
const initData=require("./data");

const urlDb= process.env.MONGO_URI;
console.log("DB URI: ", urlDb);

main().then(()=>{
        console.log("Connection is established");
    })
    .catch((err)=>{
        console.log(err);
    })
async function main(){
    mongoose.connect(urlDb);
}

main();
const initDb = async () => {
    // Create a new array with the owner information added to each object
    const modifiedData = initData.data.map((obj) => ({ ...obj, owner: "68729e73cdd25d4b0c039696" }));

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