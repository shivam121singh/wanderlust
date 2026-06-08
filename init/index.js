const mongoose = require("mongoose");
const initdata = require("../init/data.js");
const listing = require("../listing/schema");

async function initdb() {
    try {
        
        await mongoose.connect("mongodb://localhost:27017/wanderlust");
        console.log("✅ database connected");

        await listing.deleteMany({});
         initdata.data=initdata.data.map((obj)=>({...obj,owner:"6a1a9c016f87469c8bca598a"}));
        //user to define a owner for every listing so that a owner only can delete and edit the data 

        await listing.insertMany(initdata.data);

        console.log("✅ data initialized");

        mongoose.connection.close();
    } catch (err) {
        console.log(err);
    }
}

initdb();