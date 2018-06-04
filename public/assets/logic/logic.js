$(document).ready(function(){

//articles show up when site is loaded
$.getJSON("/articles", function(data) {
  renderArticles(data);
});

function renderArticles(results){
  //set loop to run the max number of articles or 20
  var length = results.length || 20;

  //empty html so no duplicates
  $("#allArticles").empty(); 
  $("#savedArticles").empty();

  //loop through db to create cards
  for (var i=0; i< length; i++){
    var newBtn;
    var newBtn2;
    // console.log(results);
    var newCard = $("<div>").addClass("card");
    newCard.attr("id", results[i]._id);
    var newBody = $("<div>").addClass("card-body");
    var newTitle = $("<h5>").addClass("card-title").text(results[i].title);
    var newLink = $("<a>").attr("href", results[i].link);
    newLink.attr("target", "_blank");    

    //if article is saved, add "delete" & "notes" btns
    if (results[i].saved){
      newBtn = $("<a>").addClass("btn btn-outline-secondary deleteArticle").text("Delete from saved");

      newBtn2 = $("<a>").addClass("btn btn-outline-secondary articleNotes").text("Article notes");
      newBtn2.attr({"dataId": results[i]._id, "type": "button", "data-target": "#notesModal", "data-toggle": "modal"});
    }
    //else add "save article"
    else {
      newBtn = $("<a>").addClass("btn btn-outline-secondary saveArticle").text("Save article");
    }
      newBtn.attr("dataId", results[i]._id);
      newBtn.attr("type", "button");

    var newText = $("<p>").addClass("card-text").text(results[i].summary);

    newLink.append(newTitle);
    newBody.append(newLink, newText, newBtn);
    newCard.append(newBody);

    //if article is saved, add to saved page and change buttons
    if (results[i].saved){
      newBody.append(newBtn2);
      $("#savedArticles").append(newCard);
    }  
    //otherwise put them on the home page
    else {
      $("#allArticles").append(newCard); 
    }  
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
      console.log("articles scraped");
    });
  })

});

//click "save article" from home pages
$(document).on("click", ".saveArticle", function(){
  var thisId = $(this).attr("dataId");
  var card = this.parentElement.parentElement;
  
  $.ajax({
    method: "PUT",
    url: "/articles/" + thisId,
    data: {
      saved: true
    }
  })
  .then(function(data){
    console.log("article saved");
    $(card).detach();
  })
});

//click "delete from saved" from saved page
$(document).on("click", ".deleteArticle", function(){
  var thisId = $(this).attr("dataId");
  var card = this.parentElement.parentElement;

  $.ajax({
    method: "PUT",
    url: "/articles/" + thisId,
    data: {
      saved: false
    }
  })
  .then(function(data){
    console.log("article deleted");
    $(card).detach();
  })
});

//click "article notes" pops up notes modal
$(document).on("click", ".articleNotes", function(){
  // $("#notes").empty();
  var thisId = $(this).attr("dataId");
  console.log(thisId);

  // getElement("#notesModal").modal("show");
  document.getElementById("notesModal").showModal();

  //ajax call for the specific article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  //add modal to page
  .then(function(data){
    console.log(data);
    
  });

});

//click "save article notes"
$(document).on("click", "#saveNotes", function(){
  var thisId = $(this).attr("dataId");

  //api post request
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#noteTitle").val(),
      body: $("#noteBody").val()
    }
  })
  .then(function(data){
    console.log(data);
    $("#notes").empty();
  });

  //clear notes modal
  $("#notesTitle").val("");
  $("#notesBody").val("");
})

}) //end document.ready
