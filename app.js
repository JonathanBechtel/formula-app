var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var session = require('express-session');
var bcrypt = require('bcrypt');
var flash = require('connect-flash');

app.use(cookieParser());
// Express Session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
  }));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//initialize passport for app
app.use(passport.initialize());
app.use(passport.session());

// make mongodb available to the application
app.use((req, res, next) => {
  mongo.connect('mongodb://localhost:27017/formulas', (e, db) => {
    if (e) return next(e);
    req.db = db;
    next();
  });
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

//define routes
var root = require('./routes/index');
var authenticate = require('./routes/authenticate');
var about = require('./routes/about');
var contact = require('./routes/contact');
var formula = require('./routes/formula');
var formulaAPI = require('./routes/api/formula');
var formulaList = require('./routes/formula-list');
var formulaListAPI = require('./routes/api/formula-list');


app.use(root);
app.use(about);
app.use(contact);
app.use(formula);
app.use(formulaAPI);
app.use(formulaList);
app.use(formulaListAPI);
app.use(authenticate);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
  console.log("The server is now listening on port "+app.get('port'));
});

module.exports = app;
