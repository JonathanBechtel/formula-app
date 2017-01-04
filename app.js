var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/formulas');

//define routes
var root = require('./routes/index');
var about = require('./routes/about');
var contact = require('./routes/contact');
var formula = require('./routes/formula');
var formulaAPI = require('./routes/api/formula');
var formulaList = require('./routes/formula-list');
var formulaListAPI = require('./routes/api/formula-list');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use(root);
app.use(about);
app.use(contact);
app.use(formula);
app.use(formulaAPI);
app.use(formulaList);
app.use(formulaListAPI);

app.listen(3000, function(){
  console.log("The port is now listening at 3000");
});

module.exports = app;
