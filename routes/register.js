var app = require('express');
var router = app.Router();
var assert = require('assert');
var bcrypt = require('bcrypt');

router.get('/register', function(req, res){
  res.render('register', {
    errors: null,
    registered: null,
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
  var username = req.body.username;
  var username2 = req.body.username2;
  var password = req.body.password;
  var password2 = req.body.password2;
  var db = req.db.collection('users');

  //Validate Input
  req.checkBody('name', 'Your Name is required').notEmpty();
  req.checkBody('username', 'Please enter a valid e-mail address').isEmail();
  req.checkBody('username', 'The e-mail field cannot be empty.').notEmpty();
  req.checkBody('username2', 'The second e-mail field cannot be empty.').notEmpty();
  req.checkBody('username2', 'Please enter a valid e-mail address for the 2nd e-mail').isEmail();
  req.checkBody('username', 'E-mail addresses do not match.').equals(username2);
  req.checkBody('password', 'Please enter a password between 8 and 24 characters in length').isLength({min: 8, max: 24});
  req.checkBody('password', 'Please make sure password contains a number, uppercase letter, and special character').matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])/);
  req.checkBody('password', 'Please enter something for your password.').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

  var errors = req.validationErrors();

  //if validation errors then send error messages
  if (errors) {
    res.render('register', {
      errors: errors,
      registered: null,
      title: 'Register to Become A User of the Formula Generator',
      description: 'Users of the Formula Generator can create, modify, and get prices on formulas',
      ID: 'register',
      keywords: 'formula generator, formula generator registration, supplement analyzer, formula generator signup form',
      user: req.user,
      loggedIn: req.isAuthenticated()
    });
  //if not, check to see if e-mail address already exists
  } else {
      var query = db.find({"username": username}).toArray(function(err, docs){
          assert.equal(null, err);
          //if yes, display page w/ error message
          if (docs.length > 0) {
            var error = {msg: "This e-mail address already exists.  Try logging in instead."}
            var messages = [];
            messages.push(error);
            res.render('register', {
              errors: messages,
              registered: false,
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
                  "username": username,
                  "password": hash,
                  "formulas": []
                }, function(err, result){
                    assert.equal(null, err);
                    res.render('register', {
                      errors: null,
                      registered: true,
                      title: 'Register to Become A User of the Formula Generator',
                      description: 'Users of the Formula Generator can create, modify, and get prices on formulas',
                      ID: 'register',
                      keywords: 'formula generator, formula generator registration, supplement analyzer, formula generator signup form',
                      user: req.user,
                      loggedIn: req.isAuthenticated()
                    });
                });
              });
            });
          }
      });
    }
});

module.exports = router;