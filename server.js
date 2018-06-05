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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper4";

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

    var count = 0;

    //get all the h3 tags from website
    $("article.story").each(function(index, element){

      var results ={};

      var link = $(element).children("h2.story-heading").children("a").attr("href");
      var title = $(element).children("h2.story-heading").children("a").text().trim();
      var summary = $(element).children("p.summary").text().trim();
      // console.log("link: "+ link);
      // console.log("title: "+title);

      //filter out ads and junk
      if (typeof title !== "undefined" && typeof link !== "undefined"){

        results.title = title;
        results.link = link;
        results.summary = summary;

        // construct new Article using results
        db.Article.create(results)
        .then(function(dbArticle){
          count++;
        })
        .catch(function(err){
          return res.json(err);
        })         
      }
    });
  res.send("Articles scraped!");
  console.log(count+" new articles added");
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

//get one article to add notes
app.get("/articles/:id", function(req, res){
  db.Article.findById(
    {_id: req.params.id}, function(err, data){
      // console.log(data);
    })
  .populate("note")
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

//update article's "saved" field
app.put("/articles/:id", function(req,res){
  // console.log(req.params.id);
  db.Article.findOneAndUpdate(
    { _id: req.params.id }, 
    { $set: {saved: req.body.saved }},
    { new: true }
  )
  .then(function(dbArt){
    res.json(dbArt);
  })
  .catch(function(err){
    res.json(err);
  })
});

//save article's note
app.post("/articles/:id", function(req, res){
  // console.log("here: "+req.params.id);
  db.Note.create(req.body)
  .then(function(dbNote){
    return db.Article.findByIdAndUpdate(
      {_id: req.params.id},
      {note: dbNote._id},
      {new: true});
  })
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