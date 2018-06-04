$(document).ready(function(){

//articles show up when site is loaded
$.getJSON("/articles", function(data) {
  renderArticles(data);
});

function renderArticles(results){
  //set loop to run the max number of articles or 20
  var length = results.length || 20;
  $("#allArticles").empty(); //empty html so no duplicates

  //loop through db to create cards
  for (var i=0; i< length; i++){
    // console.log(results);
    var newCard = $("<div>").addClass("card");
    var newBody = $("<div>").addClass("card-body");
    var newTitle = $("<h5>").addClass("card-title").text(results[i].title);
    var newLink = $("<a>").attr("href", results[i].link);
    newLink.attr("target", "_blank");    

    var newBtn = $("<a>").attr("href", results[i].link).addClass("btn").text("Save article");

    var newText = $("<p>").addClass("card-text").text(results[i].summary);

    newLink.append(newTitle);
    newBody.append(newLink, newText, newBtn);
    newCard.append(newBody);
    $("#allArticles").append(newCard);     
  }
}

//clicked "scrape new articles" btn from home page
$("#scrapeNew").on("click", function(){
  console.log("hi");
  //need to scrape to set up db for first time
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  //get all the articles sent to the /articles page in json format
  .then(function(){
    $.getJSON("/articles", function(data) {
    renderArticles(data);
    });
  })

});

//click "save article" from home pages
$(document).on("click", )
//click "delete from saved" from saved page

//click "article notes" from saved page

}) //end document.ready
