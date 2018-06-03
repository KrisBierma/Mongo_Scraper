$(document).ready(function(){

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
  // $.getJSON("/scrape", function(data){
  //   renderArticles(data);
  // });
});

//click "save article" from home pages
//click "delete from saved" from saved page

//click "article notes" from saved page

}) //end document.ready
