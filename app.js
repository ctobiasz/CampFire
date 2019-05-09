var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");
var seedDB     = require("./seeds");

mongoose.connect("mongodb://localhost:27017/camp_fire", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", (req, res) => {
  res.render("landing")
});

//INDEX - show all campgrounds
app.get("/campgrounds", (req, res ) => {
  // Get all campgrounds from DB
   Campground.find({}, function(err, allCampgrounds){
     if(err){
       console.log(err);
     } else {
       res.render("campgrounds/index", {campgrounds:allCampgrounds});
     }
   });
});
//CREATE - add new campground to DB
app.post("/campgrounds", (req,res) => {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc}
  // Create a new campground and sae to DB
   Campground.create(newCampground, function(err, newlyCreated){
     if(err){
       console.log(err);
     } else {
       //redurect back to campgrounds page
       res.redirect("/campgrounds");
     }
   });
});
//NEW  - show form to create new campground
app.get("/campgrounds/new", (req,res) => {
  res.render("campgrounds/new")
});
// SHOW - shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});


// ===============
// COMMENTS ROUTES
// ===============

app.get("/campgrounds/:id/comments/new", function(req, res){
  // find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
});

app.post("/campgrounds/:id/comments", function(req, res){
  //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
     if(err){
       console.log(err);
       res.redirect("/campgrounds");
     } else {
        Comment.create(req.body.comment, function(err, comment){
          if(err){
            console.log(err);
          } else {
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
          }
        });
     }
   });
  //create new comment
  //connect new comment to campground
  //redirect campground show page
});



app.listen(process.env.PORT, process.env.IP, () => {
  console.log("The CampFire Has Started!")
});

app.listen(3000,  () => {
console.log("Express server listening on port 3000");
});
