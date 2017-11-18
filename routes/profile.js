var app = require('express');
var router = app.Router();
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');

router.get('/users/:username/profile', function(req, res){
  res.render('profile', {
    profileChanged: false,
    errors: null,
    title: 'Your Profile',
    description: 'View and edit your profile information',
    ID: 'profile-page',
    keywords: 'formula generator profile page',
    user: req.user,
    loggedIn: req.isAuthenticated()
  });
});

router.post('/users/:username/profile', function(req, res) {
  //declare all form variables
  var name           = req.body.name;
  var username       = req.body.username;
  var oldPassword    = req.body.oldPassword;
  var newPassword    = req.body.newPassword;
  var newPassword2   = req.body.newPassword2;
  var changePassword = req.body.changePassword;
  var oldPassword    = req.body.oldPassword;
  var newPassword    = req.body.newPassword;
  var newPassword2   = req.body.newPassword2;
  var company        = req.body.company;
  var phoneNumber    = req.body.phoneNumber;

  //connect to db;
  var db = req.db.collection('users');

  //establish validation rules
  req.checkBody('name', 'Your Name is required').notEmpty();
  req.checkBody('name', 'Your name must be between 2 and 35 characters').isLength({min: 2, max: 35});
  req.checkBody('username', 'Please enter a valid e-mail address').isEmail();
  req.checkBody('username', 'The e-mail field cannot be empty.').notEmpty();

  //if user indicates that they'd like to change their password, validate existing and proposed password fields
  if (changePassword === 'on') {
    req.checkBody('newPassword', 'Please enter a password between 8 and 24 characters in length').isLength({min: 8, max: 24});
    req.checkBody('newPassword', 'Please make sure password contains a number, uppercase letter, and special character').matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])/);
    req.checkBody('oldPassword', 'Please enter something for your existing password.').notEmpty();
    req.checkBody('newPassword', 'Please enter something for your new password.').notEmpty();
    req.checkBody('newPassword2', 'Your new passwords do not match.').equals(newPassword);
  }

  var errors = req.validationErrors();

  //if errors, display the page w/ error messages
  if (errors) {
    res.render('profile', {
      profileChanged: false,
      errors: errors,
      title: 'Your Profile',
      description: 'View and edit your profile information',
      ID: 'profile-page',
      keywords: 'formula generator profile page',
      user: req.user,
      loggedIn: req.isAuthenticated()
    });
  //if no errors, then move on
  } else {
    //if they don't want to change password, then just update non-password fields and render page
    if (changePassword !== 'on') {
      db.updateOne({"_id": new ObjectID(req.user.id)}, {
        $set: {
          "name"        : name,
          "username"    : username,
          "company"     : company,
          "phoneNumber" : phoneNumber
        }
      }, function(err, r) {
          if (err) {throw err;}
          assert.equal(1, r.matchedCount);
          assert.equal(1, r.modifiedCount);
      });
      req.user.name = name;
      //req.user.username = username;
      res.render('profile', {
        profileChanged: true,
        errors: null,
        title: 'Your Profile Changes Have Been Updated',
        description: 'You might have to log back in to see the changes',
        ID: 'profile-page-changed',
        keywords: 'formula generator profile page',
        user: req.user,
        loggedIn: req.isAuthenticated()
      });
      //if they do want to change their password, proceed with password lookups & hashing
    } else {
        bcrypt.compare(oldPassword, req.user.password, function(err, results){
          if (err) {
            throw err;
          }
          if (results === false) {
            res.render('profile', {
              profileChanged: false,
              errors: [{msg: "Your existing password didn't match what we have on record."}],
              title: 'Your Profile',
              description: 'View and edit your profile information',
              ID: 'profile-page-changed',
              keywords: 'formula generator profile page',
              user: req.user,
              loggedIn: req.isAuthenticated()
            });
          } else {
            var saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(newPassword, salt, function(err, hash) {
                db.updateOne({"_id": new ObjectID(req.user.id)}, {
                  $set: {
                    "name"        : name,
                    "username"    : username,
                    "company"     : company,
                    "phoneNumber" : phoneNumber,
                    "password"    : hash
                  }
                }, function(err, r) {
                    assert.equal(null, err);
                    assert.equal(1, r.matchedCount);
                    assert.equal(1, r.modifiedCount);
                });
              });
            });
            res.render('profile', {
              profileChanged: true,
              errors: null,
              title: 'Your Profile Changes Have Been Updated',
              description: 'You might have to log back in to see the changes',
              ID: 'profile-page-changed',
              keywords: 'formula generator profile page',
              user: req.user,
              loggedIn: req.isAuthenticated()
            });
          }
        });
    }
  }
});

module.exports = router;
