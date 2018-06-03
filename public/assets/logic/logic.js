$(document).ready(function(){
// var cheerio = require("cheerio");
// var request = require("request");

//show new articles on page load
// request("http://www.nytimes.com", function(error, response, html) {
//   var $ = cheerio.load(html);
//   var results = [];

//   $("h2.story-heading").each(function(index, element){
//     var link = $(element).children().attr("href");
//     var title = $(element).children().text();

//     results.push({
//       title:title,
//       link:link
//     });

//     // renderArticles(results);
//     console.log(element);
//   })
// });

function renderArticles(results){
  var newCard = $("<div>").addClass("card");
  // var newImg = $("<img>").attr("src", results.)//how to get pic???
  // newImg.attr("alt", results.)
  var newBody = $("<div>").addClass("card-body");
  var newTitle = $("<h5>").addClass("card-title").text(results.title);
  // var newText = $("<p>").addClass("card-text").text(results.)
  var newLink = $("<a>").attr("href", results.link).addClass("btn").text("Go to NYT");

  // newBody.append(newTitle, newText, newLink); //keep
  // newCard.append(newBody, newImg);  //keep
  newBody.append(newTitle, newLink);
  newCard.append(newBody);
  $("#allArticles").append(newCard);
}

//clicked "scrape new articles" btn from home page
$("#scrapeNew").on("click", function(){
  alert("hi");
});

//click "save article" from home page

//click "delete from saved" from saved page

//click "article notes" from saved page

}) //end document.ready
