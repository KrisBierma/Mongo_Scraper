//get access to npm for server
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");

//for db
var mongoose = require("mongoose");

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

//get api routes
require("./controller/api-routes")(app);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper4";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.listen(PORT, function() {
  console.log("App listening on PORT" + PORT);
});