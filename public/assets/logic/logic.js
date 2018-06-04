$(document).ready(function(){

function renderArticles(results){
  for (var i=0; i< 20; i++){
    var newCard = $("<div>").addClass("card");
    var newBody = $("<div>").addClass("card-body");
    var newTitle = $("<h5>").addClass("card-title").text(results[i].title);
    var newText = $("<p>").addClass("card-text").text(results[i].summary);
    console.log(results[i].summary);
    var newLink = $("<a>").attr("href", results[i].link).addClass("btn").text("Go to NYT");
    newLink.attr("target", "_blank");

    newBody.append(newTitle, newText, newLink);
    newCard.append(newBody);
    $("#allArticles").append(newCard);     
  }
}

//clicked "scrape new articles" btn from home page
$("#scrapeNew").on("click", function(){
  $.getJSON("/articles", function(data) {
    renderArticles(data);
  });
});

//click "save article" from home pages
//click "delete from saved" from saved page

//click "article notes" from saved page

}) //end document.ready
