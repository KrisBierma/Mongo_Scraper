var db = require("../models");

//for scraping
var cheerio = require("cheerio");
var axios = require("axios");

//routes...
module.exports = function(app){

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

        //filter out ads and junk
        if (typeof title != "undefined" && typeof link != "undefined" && summary !== ""){

          results.title = title;
          results.link = link;
          results.summary = summary;

          // construct new Article using results
          db.Article.insertMany(results)
          .then(function(dbArticle){
            count++;
            console.log(count);
            console.log(results);
          })
          .catch(function(err){
            // console.log(err);
          })         
        }
      })
    console.log(count+" new articles added");
    // res.send("Articles scraped!");
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

}