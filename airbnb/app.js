const express=require("express")
const app=express()
const path=require("path")
const mongoose=require("mongoose")
const engine = require('ejs-mate')
app.engine('ejs', engine);
const {listingSchema}=require("./listingSchema.js")
const Listing=require("./models/listing.js");
app.use(express.static(path.join(__dirname, "public")));
const methodOverride=require("method-override")
let MONGO_URL="mongodb://127.0.0.1:27017/wanderLust"
const wrapAsync=require("./utils/wrapasync.js")
const ExpressError=require("./utils/ExpressError.js")
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"views"))
app.use(methodOverride("_method"))
app.get("/listing/new",(req,res)=>{
    console.log("New called")
    res.render("listing/form.ejs");

})
app.get("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    
    console.log("response sent");
    res.render("listing/show.ejs",{list})
})
app.put("/listing/:id", async (req, res) => {
    console.log("called put")
    const { id } = req.params;
    try {
        await Listing.findByIdAndUpdate(id,{ ...req.body.list});
        res.redirect("/listing");
    } catch (err) {
        console.log("Validation Error:", err);
        res.send("Update failed");
    }
});

app.listen(8080,()=>{
    console.log("Server is Listning")
})
app.get("/",(req,res)=>{
    res.send("Root");
})

app.post("/listing",wrapAsync(
    async (req, res,next) => {
           const result=  listingSchema.validate(req.body);
             console.log(result);
            let list = req.body.list;
            let newElement = new Listing(list);
          
            await newElement.save();
                res.redirect("/listing")
            
       
})

);

app.get("/listing/:id/edit",async (req,res)=>{
      let {id}=req.params;
      let element =await Listing.findById(id);
      res.render("listing/edit.ejs",{element});
})
app.get("/listing",async (req,res)=>{
    let list=await Listing.find({})
    // console.log(list);
    // console.log("response sent");
    res.render("listing/index.ejs",{list})
})


// app.get("/testlisting",()=>{
//       let sample=new Listing(
//         {
//             title: "New Villa",
//             description:"Country Side",
//             image:"https://unsplash.com/photos/a-bird-flies-gracefully-through-the-sky-_6sc3AzkEyA",
//             price: 1200,
//             location:"Mumbai",
//              country:"India",
//         }
//       )
//       sample.save();
// })
async function main(){
   await mongoose.connect(MONGO_URL)
}
main().then(()=>{
    console.log("Connected")
})
.catch((e)=>{
   console.log(e);
})
app.delete("/listing/:id",wrapAsync(async (req,res)=>{
    console.log("Delete route")
       let {id}=req.params

         await Listing.findByIdAndDelete(id);
         res.redirect("/listing")

}));

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    // Capture only the first few lines of the stack
    const trace = err.stack.split('\n').slice(0, 3).join('\n'); // Get the first 3 lines
    res.render("listing/error.ejs", {
        err: { message: err.message, trace }
    });
});
