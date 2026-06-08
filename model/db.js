const mongoose=require("mongoose")
async function connection(){
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("database connected")
}

module.exports=connection;