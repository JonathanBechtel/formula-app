var express          = require('express');
var app              = express();
var bodyParser       = require('body-parser');
var cookieParser     = require('cookie-parser');
var expressValidator = require('express-validator');
var passport         = require('passport');
var localStrategy    = require('passport-local').Strategy;
var mongo            = require('mongodb').MongoClient;
var session          = require('express-session');
var bcrypt           = require('bcrypt');
var flash            = require('connect-flash');

//define middleware
app.use(cookieParser());
// Express Session
app.use(session({
  secret: 's%kf$lwDF98d2fr4',
  resave: false,
  saveUninitialized: true
  }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//initialize passport for app
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// make mongodb available to the application
app.use((req, res, next) => {
  mongo.connect('mongodb://jb_heroku:sKLQ684j#$@ds127044.mlab.com:27044/heroku_wp406fgr', (e, db) => {
    if (e) return next(e);
    req.db = db;
    next();
  });

  // cleanup
  req.on('end', () => { req.db.close(); });
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root        = namespace.shift()
      , formParam   = root;

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

//define routes
var root = require('./routes/index');
var about = require('./routes/about');
var contact = require('./routes/contact');
var formula = require('./routes/formula');
var formulaAPI = require('./routes/api/formula');
var formulaList = require('./routes/formula-list');
var register = require('./routes/register');
var login = require('./routes/login');
var profile = require('./routes/profile');
var forgotPassword = require('./routes/forgot-password');
var resetPassword = require('./routes/reset-password');
var pdf = require('./routes/pdf');
var suppliers = require('./routes/suppliers');
var work = require('./routes/work');

app.use(root);
app.use(about);
app.use(contact);
app.use(formula);
app.use(formulaAPI);
app.use(formulaList);
app.use(register);
app.use(login);
app.use(profile);
app.use(forgotPassword);
app.use(resetPassword);
app.use(pdf);
app.use(suppliers);
app.use(work);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
  console.log("The server is now listening on port "+app.get('port'));
});

module.exports = app;
