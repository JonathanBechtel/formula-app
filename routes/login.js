var app = require('express');
var router = app.Router();
var assert = require('assert');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  mongo.connect("mongodb://localhost:27017/formulas", function(e, db){
    if (e) {return next(e);}
    var col = db.collection("users");
    col.findOne({"username": id}, function(err, user){
      done(err, {"id": user._id, "username": id, "name": user.name, "password": user.password, "formulas": user.formulas});
    });
  });
});

passport.use(new LocalStrategy(
 function(username, password, done) {
   //Fire up database
    mongo.connect("mongodb://localhost:27017/formulas", function(e, db) {
      if (e) {return next(e);}
      var col = db.collection("users");
      //Do a database query to find a record by username
          col.findOne({"username": username}, function(err, user){
            if (err) { return done(err);}
            if(!user) {
              return done(null, false, { message: "Please check your username." });
            }
            //if it exists call done() object with user information
            bcrypt.compare(password, user.password, function(err, res){
              if (err) throw err;
              if (res == true) {
                return done(null, {username: username, password: password});
              } else {
                return done(null, false, { message: "Invalid password."});
              }
            });
          });
        });
      }));

router.get('/login', function(req, res){
  res.render('login', {
    errors: req.flash().error,
    title: 'Formula Generator Login',
    description: 'Log in to your Formula Generator account',
    ID: 'login',
    keywords: 'formula generator, formula generator registration, supplement analyzer, formula generator signup form',
    user: req.user,
    loggedIn: req.isAuthenticated()
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username.substring(0, user.username.indexOf('@')));
    });
  })(req, res, next);
});

/*router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: true}),
    function(req, res){
      console.log(req.session);
    });*/

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports = router;
