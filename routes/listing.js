const express=require("express");
const router=express.Router();
const listing = require("../listing/schema.js");


//show route
router.get("/new",(req,res)=>{
res.render("listing/new");
})

//edit route 

  router.get("/:id/edit", async (req,res)=>{
 let { id } = req.params;
const foundlisting  = await listing.findById(id); 
 res.render("listing/edit",{foundlisting})
  })

 //show routes
router.get("/:id", async (req, res) => {
    let { id } = req.params;

    const foundListing = await listing.findById(id).populate("reviews"); 

    res.render("listing/show", { listing: foundListing }); 
});




router.post("/",  async (req,res,next)=>{
    let {title,description,image,price,country,location}=req.body
     console.log(req.body);

     let  databasestorage=new listing({
        title,
        description,
        image,
        price,
        country,
        location

     })
     //create new route
try{
 await  databasestorage.save()
        console.log("data added in the database successfully")
    res.redirect("/listing");
}catch(err){
 next(err);
}
    
})

 //update and edit route
 router.post("/edit",(req,res)=>{
    const data=req.body;
    console.log(data);
  })

  //update route 
 router.put("/:id", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, req.body);
    res.redirect("/listing");
    console.log("data edited successfully")
});

//delete listing
router.delete("/:id", async(req,res)=>{
    let {id}=req.params
    let deletelisting=await listing.findByIdAndDelete(id);
    console.log(deletelisting);
    console.log("Data deleted")
    res.redirect("/listing");
})


module.exports=router;

.//you can delete it iska koi kamnhi hai