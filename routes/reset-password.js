var app = require('express');
var router = app.Router();
var assert = require('assert');
var bcrypt = require('bcrypt');

router.get('/reset-password/:token', function(req, res){
  var db = req.db.collection('users');
  var token = req.params.token;
  var rightNow = new Date().valueOf();
  var oneHour = 3600000;

  db.findOne({"passwordReset.token": token}, function(err, user){
    if (err) {
      throw err;
    };
    if (!user || (rightNow - user.passwordReset.created > oneHour)) {
      res.render('reset-password', {
        updated: false,
        token: 0,
        errors: null,
        title: 'Request Not Identified',
        description: 'Either your token was not valid or your request was not satisfied within one hour.',
        ID: 'reset-password',
        keywords: 'formula generator, password reset, formula generator password change',
        loggedIn: req.isAuthenticated()
      });
    } else {
      res.render('reset-password', {
        updated: false,
        token: token,
        errors: null,
        title: 'reset-password',
        description: 'Enter your new password twice and hit Submit.',
        ID: 'reset-password',
        keywords: 'formula generator, password reset, formula generator password change',
        loggedIn: req.isAuthenticated()
      });
    };
  });
});

router.post('/reset-password/:token', function(req, res){
  var token = req.params.token;
  var password = req.body.password;
  var password2 = req.body.password2;
  var db = req.db.collection('users');

  //validate input;
  req.checkBody('password', 'Please enter a password between 8 and 24 characters in length').isLength({min: 8, max: 24});
  req.checkBody('password', 'Please make sure password contains a number, uppercase letter, and special character').matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])/);
  req.checkBody('password', 'Please enter something for your password.').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    res.render('reset-password', {
      updated: false,
      token: token,
      errors: errors,
      title: 'reset-password',
      description: 'Please correct the following error messages.',
      ID: 'reset-password',
      keywords: 'formula generator, password reset, formula generator password change',
      loggedIn: req.isAuthenticated()
    });
  } else {
    bcrypt.hash(password, 10, function(err, hash) {
        db.update({"passwordReset.token": token}, {
          $set: {
            "password": hash
          }}, function(err, r){
            assert.equal(null, err);
            assert.equal(null, r.matchedCount);
        });
    });
    res.render('reset-password', {
      updated: true,
      token: 0,
      errors: null,
      title: 'Your password was reset.',
      description: 'Please proceed to the login page.',
      ID: 'reset-password',
      keywords: 'formula generator, password reset, formula generator password change',
      loggedIn: req.isAuthenticated()
    });
  }
});

module.exports = router;
