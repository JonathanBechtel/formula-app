var app = require('express');
var router = app.Router();

router.get('/forgot-password', function(req, res) {
  res.render('forgot-password', {
    errors: null,
    title: 'Reset Your Password',
    description: 'Enter your e-mail below to receive a link to reset your password.',
    ID: 'Reset your password',
    keywords: 'password reset, formula generator, formula generator forgotten password',
    loggedIn: req.isAuthenticated()
  })
});

module.exports = router;
