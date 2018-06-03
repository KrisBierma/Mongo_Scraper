var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//make constructore
var NoteSchema = new Schema({
  title: String,
  body: String
});

//creates model based on mongoose model using above constructor
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;