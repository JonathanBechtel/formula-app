var app = require('express');
var router = app.Router();
var crypto = require('crypto');
var message = require('../models/mailer.js');

router.get('/forgot-password', function(req, res) {
  res.render('forgot-password', {
    emailFound: false,
    errors: req.flash().error,
    title: 'Reset Your Password',
    description: 'Enter your e-mail below to receive a link to reset your password.',
    ID: 'forgot-password',
    keywords: 'password reset, formula generator, formula generator forgotten password',
    loggedIn: req.isAuthenticated()
  });
});

router.post('/forgot-password', function(req, res){
  var email = req.body.username;
  var db = req.db.collection('users');
  var token = crypto.randomBytes(32).toString('hex');
  var rightNow = new Date().valueOf();

  db.findOneAndUpdate({"username": email}, {$set: {"passwordReset.token": token, "passwordReset.created": rightNow}}, function(err, result){
    var user = result.value;
    console.log(user);
    if (err) {
      throw err;
    };
    if(!user) {
      req.flash('error', 'E-mail not found in database.');
      res.redirect('/forgot-password');
    } else {
      res.render('forgot-password', {
        emailFound: true,
        title: 'Request Received.  Please Check E-mail',
        description: 'Check the e-mail you entered in the form to find the link to reset your password.',
        ID: 'forgot-password',
        keywords: 'password reset, formula generator, formula generator forgotten password',
        loggedIn: req.isAuthenticated(),
        });
      message.passwordReset(email, token);
      }
    });
    req.db.close();
  });

module.exports = router;
