var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//constructs a new Schema obj 
var ArticleSchema = new Schema({
  title: {
    type: String, 
    required: true
  },
  link: {
    type: String, 
    required: true
  },
  //note obj stores Note id so we can populate article with the notes that go with it
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

//use mongoose model method to create article using schema above
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;