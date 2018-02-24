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

app.get("/", function(req, res){
    res.send("you have made it to the blog app!!!!");
});



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Blog App server has started!!");
});