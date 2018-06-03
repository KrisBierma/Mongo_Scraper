//get access to npm for server
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");

//for db
var mongoose = require("mongoose");
// var db = require("./models");

//for scraping
var cheerio = require("cheerio");
var axios = require("axios");

var PORT = process.env.PORT || 8080;

//initialize/ set-up server
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));//static directory
app.use(logger("dev")); //for logging requests

//set up handlebars as templating language
var exphbs = require("express-handlebars");
app.engine("hbs", exphbs({
  defaultLayout: "main", extname: ".hbs"
}));
app.set("view engine", "hbs");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//routes...
//get articles from nbcNews
app.get("/scrape", function(req, res){
  //get html body with axios
  axios.get("https://www.nbcnews.com/news/weird-news").then(function(response) {
  //set up cheerio to load and sift through html
    var $ = cheerio.load(response.data);

    //get all the h3 tags from website
    $("h3.item-heading").each(function(index, element){
      //save everythig in obj
      var results ={};

      console.log(element);

      // results.link = $(element).children().attr("href");
      // results.title = $(element).children().text();

  })
  })
});

app.listen(PORT, function() {
  console.log("App listening on PORT" + PORT);
});