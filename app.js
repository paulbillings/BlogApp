var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express = require("express");
var app = express();

// connect to the database
mongoose.connect("mongodb://localhost/blog_app");

// set ejs for use on route files
app.set("view engine", "ejs");

// setup public so express can see my app.css
app.use(express.static("public"));

// so i can retrieve the data sent from a request
app.use(bodyParser.urlencoded({extended: true}));

// schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

// model
var Blog = mongoose.model("Blog", blogSchema);

// blog test example
// Blog.create({
//   title: "Test blog",
//   image: "http://www.petwave.com/-/media/Images/Center/Breed/Dogs/Toy-Group/Pug/Pug-face-closeup.ashx",
//   body: "The test blog which happens to show a cute pug :)"
// });

// ******* RESTful routes ***********
// conventional for root to show the index route
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

// index route
app.get("/blogs", function(req, res){
    res.render("index");
});



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Blog App server has started!!");
});