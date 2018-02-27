var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var express = require("express");
var app = express();

// connect to the database
mongoose.connect("mongodb://localhost/blog_app");

// APP CONFIG
// set ejs for use on route files
app.set("view engine", "ejs");

// setup public so express can see my app.css
app.use(express.static("public"));

// so i can retrieve the data sent from a request
app.use(bodyParser.urlencoded({extended: true}));

// so i can do put, delete requests
app.use(methodOverride("_method"));

// tell app to use sanitizer
app.use(expressSanitizer());

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
    Blog.find({}, function(err, blogs){
        if(err){
            console(err);
        } else {
             res.render("index", {blogs: blogs});
        }
    })
});

// new route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// create route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// show route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog})
       }
    });
});

// edit route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
          res.redirect("/blogs");
       } else {
          res.render("edit", {blog: foundBlog}); 
       }
    });
});

// update route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

// delete route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    }) 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Blog App server has started!!");
});