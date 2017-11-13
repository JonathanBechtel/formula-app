var app = require('express');
var router = app.Router();
var assert = require('assert');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var Recaptcha = require('express-recaptcha');
var recaptcha = new Recaptcha('6LfAYTgUAAAAAMjLms1Y9yv_ER8-qJ-MXBqIJHT6', '6LfAYTgUAAAAANZsIvIuGnX37lPelHzLFzJrRLWw');

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {

  mongo.connect("mongodb://jb_heroku:sKLQ684j#$@ds127044.mlab.com:27044/heroku_wp406fgr", function(e, db){
    if (e) {return next(e);}
    var col = db.collection("users");
    col.findOne({"username": id}, function(err, user){
      done(err, {
        "id": user._id,
        "username": id,
        "company": user.company,
        "phoneNumber": user.phoneNumber,
        "activeEmail": user.activeEmail,
        "name": user.name,
        "password": user.password,
        "formulas": user.formulas
      });
    });
  });
});

passport.use(new LocalStrategy(
 function(username, password, done) {
   //Fire up database
    mongo.connect("mongodb://jb_heroku:sKLQ684j#$@ds127044.mlab.com:27044/heroku_wp406fgr", function(e, db) {
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

router.post('/login', recaptcha.middleware.render,
  passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}),
  function(req, res) {
    if (!req.recaptcha.error) {
      res.redirect('/users/' + req.user.username.substring(0, req.user.username.indexOf('@')));
    }
    else {
      console.log("User was not authenticated.");
    }
  });

router.get('/logout', function(req, res){
	req.logout();
  delete req.session.passport; //this is to avoid complications w/line 37 on formula-list.js
	res.redirect('/');
});

module.exports = router;
