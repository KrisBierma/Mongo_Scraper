//get access to npm for server
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");

//for db
var mongoose = require("mongoose");
var db = require("./models");

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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper2";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// mongoose.connect("mongodb://localhost/mongoScraper");

//routes...
//home route
app.get("/", function(req, res){
  res.render("../views/pages/home");
});

//saved articles route
app.get("/saved", function(req, res){
  res.render("../views/pages/saved");
});

//scrape articles from website
app.get("/scrape", function(req, res){
  //get html body with axios
  axios.get("https://www.nytimes.com/").then(function(response) {

  //set up cheerio to load and sift through html
    var $ = cheerio.load(response.data);

    //get all the h3 tags from website
    $("article.story").each(function(index, element){

      var results ={};

      var link = ($(element).children("a").attr("href"));
      var title = $(element).children("h2").text().trim();
      var summary;

      //make sure title and link aren't empty (ie avoid ads)
      if (title !== "" && title !== undefined && link !== undefined){
        summary = $(element).children("p.summary").text().trim();

        results.title = title;
        results.link = link;
        results.summary = summary;

        console.log(results);
      }

        // construct new Article using results
        db.Article.create(results)
        .then(function(dbArticle){
          // console.log(dbArticle);
        })
        .catch(function(err){
          return res.json(err);
        })   

    });
  res.send("Articles scraped!");
  })
});

//get all articles from db
app.get("/articles", function(req, res){
  db.Article.find({})
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

app.listen(PORT, function() {
  console.log("App listening on PORT" + PORT);
});