const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const userschema=new mongoose.Schema({
    title:{
        type:String,
        required:true},
    description:String,
      image:{
          url: {
        type: String,
        default: "https://images.unsplash.com/photo-..."
    },
    filename: {
        type: String,
        default: "default"
    },
        // default:"https://unsplash.com/photos/toucan-perched-among-lush-green-leaves-AFObnLqv6Ag",
        // set:(v)=>v==="" ? "https://unsplash.com/photos/toucan-perched-among-lush-green-leaves-AFObnLqv6Ag":v,
    },
   price:{
   type:Number,
   required:true,
},

    location:String,
    latitude:Number,
    longitude:Number,
    country:String,
    reviews:[
        {type:Schema.Types.ObjectId,
           ref:"Reviews",//reviews is a model in the reviews.js
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

const Listing = mongoose.model("Listing", userschema);
 module.exports=Listing;


 ///ref user from /model/user.js