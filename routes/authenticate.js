var app = require('express');
var router = app.Router();
var assert = require('assert');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;

router.get('/register', function(req, res){
  res.render('register', {
    messages: null,
    title: 'Register to Become A User of the Formula Generator',
    description: 'Users of the Formula Generator can create, modify, and get prices on formulas',
    ID: 'register',
    keywords: 'formula generator, formula generator registration, supplement analyzer, formula generator signup form',
    user: req.user,
    loggedIn: req.isAuthenticated()
  });
});

router.post('/register', function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  var db = req.db.collection('users');

  //Validate Input
  req.checkBody('name', 'Your Name is required').notEmpty();
  req.checkBody('email', 'Please enter a valid e-mail address').isEmail();
  req.checkBody('email', 'The e-mail field cannot be empty.').notEmpty();
  req.checkBody('password', 'Please enter a password between 8 and 24 characters in length').isLength({min: 8, max: 24});
  req.checkBody('password', 'Please enter something for your password.').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

  var errors = req.validationErrors();
  var messages = []

  //if validation errors then send error messages
  if (errors) {
    res.render('register', {
      messages: errors,
      title: 'Register to Become A User of the Formula Generator',
      description: 'Users of the Formula Generator can create, modify, and get prices on formulas',
      ID: 'register',
      keywords: 'formula generator, formula generator registration, supplement analyzer, formula generator signup form',
      user: req.user,
      loggedIn: req.isAuthenticated()
    });
  //if not, check to see if e-mail address already exists
  } else {
      var query = db.find({"email": email}).toArray(function(err, docs){
          assert.equal(null, err);
          //if yes, display page w/ error message
          if (docs.length > 0) {
            var error = {msg: "This e-mail address already exists.  Try logging in instead."}
            messages.push(error);
            res.render('register', {
              messages: messages,
              title: 'Register to Become A User of the Formula Generator',
              description: 'Users of the Formula Generator can create, modify, and get prices on formulas',
              ID: 'register',
              keywords: 'formula generator, formula generator registration, supplement analyzer, formula generator signup form',
              user: req.user,
              loggedIn: req.isAuthenticated()
            });
          //if it doesn't, create a new user w/ hashed password
          } else {
            var saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(password, salt, function(err, hash) {
                db.insertOne({
                  "name": name,
                  "email": email,
                  "password": hash
                }, function(err, result){
                    assert.equal(null, err);
                    res.redirect('/');
                });
              });
            });
          }
      });
    }
});

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  mongo.connect("mongodb://localhost:27017/formulas", function(e, db){
    if (e) {return next(e);}
    var col = db.collection("users");
    col.findOne({"email": id}, function(err, user){
      done(err, {"email": id});
    });
  });
});

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
},
 function(username, password, done) {
    mongo.connect("mongodb://localhost:27017/formulas", function(e, db) {
      if (e) {return next(e);}
      var col = db.collection("users");

          col.findOne({"email": username}, function(err, user){
            if (err) { return done(err);}
            if(!user) {
              return done(null, false, { message: "Please check your log in credentials." });
            }
            bcrypt.compare(password, user.password, function(err, res){
              if (err) throw err;
              if (res == true) {
                return done(null, {email: username, password: password});
              } else {
                return done(null, false, { message: "Invalid password."});
              }
            });
          });
        });
      }));

router.get('/login', function(req, res){
  res.render('login', {
    messages: null,
    title: 'Formula Generator Login',
    description: 'Log in to your Formula Generator account',
    ID: 'login',
    keywords: 'formula generator, formula generator registration, supplement analyzer, formula generator signup form',
    user: req.user,
    loggedIn: req.isAuthenticated()
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash: false}),
  function(req, res){
    console.log(req.user);
    console.log("The user was logged");
  });

router.get('/logout', function(req, res){
  console.log(req.user);
	req.logout();
  console.log("Successfully logged out");
	res.redirect('/login');
});

module.exports = router;
