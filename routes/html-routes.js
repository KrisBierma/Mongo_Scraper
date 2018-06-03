var path = require("path");

module.exports = function (app){
  
  //home route
  app.get("/", function(req, res){
    res.render(path.join(__dirname, "../views/pages/home"));
  });

  //saved articles route
  app.get("/saved", function(req, res){
    res.render(path.join(__dirname, "../views/pages/saved"));
  });

};