var app = require('express');
var router = app.Router();

router.get('/reset-password/:token', function(req, res){
  var db = req.db.collection('users');
  var token = req.params.token;
  var rightNow = new Date().now();
  var oneHour = 3600000;
  console.log(rightNow);
  console.log("The token is: ", token);

  db.findOne({"passwordReset.token": token}, function(err, user){
    console.log("Time elapsed since request initiated: ", rightNow - user.passwordReset.created);
    console.log("Has an hour passed? ", rightNow - user.passwordReset.created > oneHour);
    if (err) {
      throw err;
    },
    if (!user || (rightNow - user.passwordReset.created > oneHour)) {
      res.render('reset-password', {
        tokenFound: false,
        title: 'Request Not Identified',
        description: 'Either your username was not valid or your request was not satisfied within one hour.',
        ID: 'reset-password',
        keywords: 'formula generator, password reset, formula generator password change',
        loggedIn: req.isAuthenticated();
      });
    } else {
      res.render('reset-password', {
        tokenFound: true,
        title: 'Reset Your Password',
        description: 'Enter your new password twice and hit Submit.',
        ID: 'reset-password',
        keywords: 'formula generator, password reset, formula generator password change',
        loggedIn: req.isAuthenticated();
      });
    }
  });
});

module.exports = router;
