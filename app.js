require('dotenv').config()
console.log(process.env);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const  listing=require("./listing/schema.js");
 const path=require("path")
const connect=require("./model/db.js");
// const User=require("./model/user.js");
connect();
const ejsmate=require("ejs-mate")
app.engine('ejs', ejsmate);

//for map 
  const axios = require("axios");

//  middleware for authentication
const {isLoggedIn}=require("./middleware.js")

// multer use for uploading image it automatically creates a folder upload and automaticall save all files in it 
const multer  = require('multer')
//cloudinary 
const {storage}=require("./cloudconfig.js");
const upload = multer({ storage })

 
const methodoverride=require("method-override");
app.use(methodoverride("_method"));
 app.set("view engine","ejs")

 app.set("views",path.join(__dirname,"views"))
 app.use(express.static(path.join(__dirname,"/public")))
  
//database atlas
const Dburl=process.env.ATLASDB_URL;

//schema validation
const{listingSchema}=require("./schema.js")

//review schema 
const Reviews=require("./listing/reviews.js")

//session 
const session=require("express-session");
//flash  uses as alert 
const flash = require("connect-flash");

//passport and local passport

 const passport =require("passport");
const LocalStrategy = require("passport-local").Strategy;
 const User=require("./model/user.js");
// app.get("/", async (req,res)=>{
//  let samplelisting=new listing({
//     title:"my new villa",
//     descriptin:"buy and sell",
//     price:1200,
//     location:"goa",
//     coutry:"goa",
//  })
//   await samplelisting.save();
//   console.log("sample saved");

// })
//index.ejs route


//express session use to remeber the use 
const sessionOption={
    secret:"hero",
    resave:false,
    saveUninitialized:true,
    cookie:{
         expires:Date.now()+7 * 24*60*60*1000 ,
         maxAge:7*24*60*60*1000
    }
}


app.use(session(sessionOption));

app.use(flash());

///session ke bad passport use 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//

//for showing the login signup and logout button on the basic=s of req.user 

app.use((req,res,next)=>{
    res.locals.currentuser=req.user;
    next();
})


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/listing",async (req,res)=>{
   
    const alllisting= await listing.find({})
    res.render("listing/index",{alllisting})
})





//show route
//show route
app.get("/listing/new",isLoggedIn,(req, res) => {
    res.render("listing/new");
});

app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;

    const foundListing = await listing.findById(id).populate({path:"reviews",populate:{
        path:"author"
    },
}).populate("owner"); 

console.log(foundListing);

    res.render("listing/show", { listing: foundListing }); 
});

//create new route
// app.post("/listing", isLoggedIn, upload.single('avatar'), async (req,res,next)=>{

// try{

//     let {title,description,price,country,location} = req.body;

//     let url = req.file.path;
//     let filename = req.file.filename;

//     // Get coordinates
// const search = `${location}, ${country}`;
//     const response = await axios.get(
//   `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1`,
//   {
//     headers: {
//       "User-Agent": "AIRBNB-Project/1.0"
//     }
//   }
// );

//     let latitude = null;
//     let longitude = null;

//     if(response.data.length > 0){
//         latitude = response.data[0].lat;
//         longitude = response.data[0].lon;
//     }

//     // Save listing
//     let databasestorage = new listing({
//         title,
//         description,
//         image:{
//             url,
//             filename
//         },
//         price,
//         country,
//         location,
//         latitude,
//         longitude,
//         owner:req.user._id
//     });

//     await databasestorage.save();

//     console.log("data added successfully");

//     res.redirect("/listing");

// }catch(err){
//     next(err);
// }

// });
// 1. FIND THIS ROUTE IN YOUR SERVER FILE:
app.post("/listing", isLoggedIn, upload.single('avatar'), async (req,res,next)=>{

try{

    let {title,description,price,country,location} = req.body;

    let url = req.file.path;
    let filename = req.file.filename;

    
    //  REMOVE AND REPLACE EVERYTHING FROM HERE...
    
    // Get coordinates
    const search = `${location}, ${country}`;

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "AIRBNB-Project/1.0"
        }
      }
    );

    let latitude = null;
    let longitude = null;

    if(response.data.length > 0){
        latitude = response.data[0].lat;
        longitude = response.data[0].lon;
    }
    // ==========================================
    // ...DOWN TO HERE 
    // ==========================================


    // 2. PASTE THE NEW CODE RIGHT HERE INSTEAD:
    const responsee = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
    q: `${location}, ${country}`,
    format: 'json',
    limit: 1
},
        headers: {
            "User-Agent": "Wanderlust-Project/1.0" 
        }
    });

    let latitudee = null;
    let longitudee = null;

    if (response.data && responsee.data.length > 0) {
        latitude = parseFloat(responsee.data[0].lat);
        longitude = parseFloat(responsee.data[0].lon);
    } else {
        latitudee = 28.4744; 
        longitudee = 77.5040;
    }
    // ==========================================


    // Save listing (Leave this as it is)
    let databasestorage = new listing({
        title,
        description,
        image:{
            url,
            filename
        },
        price,
        country,
        location,
        latitude,
        longitude,
        owner:req.user._id
    });

    await databasestorage.save();
    console.log("data added successfully");
    res.redirect("/listing");

}catch(err){
    next(err);
}

});
 //update and edit route
 app.post("/listing/edit",isLoggedIn,async(req,res)=>{
    const data=req.body;
    console.log(data);
  })

  //listing get data or ID
  app.get("/listing/:id/edit",isLoggedIn, async (req,res)=>{
 let { id } = req.params;
const foundlisting  = await listing.findById(id); 
 res.render("listing/edit",{foundlisting})
  })

  //update route 
app.put("/listing/:id", isLoggedIn, upload.single("avatar"), async (req, res) => {
    let { id } = req.params;

    let listingData = await listing.findById(id);

    if (!listingData.owner.equals(req.user._id)) {
        return res.send(`
        <script>
            alert("You don't have permission to edit this listing");
            window.location.href="/listing";
        </script>
        `);
    }

    // update normal fields
    listingData.title = req.body.title;
    listingData.description = req.body.description;
    listingData.price = req.body.price;
    listingData.country = req.body.country;
    listingData.location = req.body.location;

    // ✅ only update image if new file uploaded
    if (req.file) {
        listingData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listingData.save();

    res.redirect(`/listing/${id}`);
});

//delete listing
app.delete("/listing/:id", isLoggedIn,async(req,res)=>{
    let {id}=req.params
    let deletelisting=await listing.findByIdAndDelete(id);
    console.log(deletelisting);
    console.log("Data deleted")
    res.redirect("/listing");
})




//  post reviews
app.post("/listing/:id/reviews",isLoggedIn,async (req, res) => {
    let foundlisting = await listing.findById(req.params.id);

    let newreviews = new Reviews(req.body.reviews);
    newreviews.author=req.user._id
    await newreviews.save();
      console.log(newreviews);
    foundlisting.reviews.push(newreviews._id); 
    await foundlisting.save();

    console.log("new review saved");

    res.redirect(`/listing/${req.params.id}`);
});


//deleting the review only author can 

app.delete("/listing/:id/reviews/:reviewId", isLoggedIn, async (req, res) => {

    let { id, reviewId } = req.params;

    let review = await Reviews.findById(reviewId);

    // Check if current user is the author
    if (!review.author.equals(req.user._id)) {
        return  res.send(`
        <script>
            alert("you have not permisson to delete the review");
            window.location.href="/listing/${id}";
            // its is use to open the given url in the same browswer
        </script>
    `);
    }

    await Reviews.findByIdAndDelete(reviewId);

    // Remove review id from listing reviews array
    await listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    res.redirect(`/listing/${id}`);
});





// app.use((err,req,res,next)=>{
//     res.send("something went's wrong ")
// })

//demo userr session login 
app.get("/demouser",async(req,res)=>{
let fakeUser=new User({
    email:"shivamsingh933434@gmail.com",
    username:"shiv@"
});
  let registeredUser=await User.register(fakeUser,"shivam");
  //fakeuser,password  

  res.send(registeredUser);
})

 

// user sign in 
 app.get("/signup",(req,res)=>{
res.render("users/signup.ejs");
 })

 //saving data in the database  model/db.js m save hoga data
 app.post("/signup",async(req,res)=>{
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
     let registeredUser=await User.register(newUser,password);
     console.log(registeredUser);
    //   req.flash("success","user welcome to shivam's website");
    //  res.redirect("/listing");
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
 res.send(`
        <script>
            alert("User registered successfully!");
            window.location.href="/listing";
            // its is use to open the given url in the same browswer
        </script>
    `);
    })
    

 })

 //login
 app.get("/login",(req,res)=>{
res.render("./users/login.ejs");
 })
//passport authenticate use to check that user exist in database or not 
app.post("/login", passport.authenticate("local", {
    // successRedirect: "/listing",
    failureRedirect: "/login",
    failureFlash: true
  }),async(req,res)=>{
    // res.send("welcome to shivam's website ")
    res.redirect("/listing/new");

})

//logout user
app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
    })
  res.send(`
        <script>
            alert("User loggedout successfully!");
            window.location.href="/listing";
        </script>
    `);
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
