var app = require('express');
var router = app.Router();

router.get('/about', function(req, res){
  res.render('about', {
    title: 'About the Formula Generator',
    description: `The Formula Generator is designed to make it easy to manage and build great nutraceutical products`,
    ID: 'about',
    keywords: 'formula generator, health kismet, nutraceutical formula builder',
    user: req.user,
    loggedIn: req.isAuthenticated()
  });
});

module.exports = router;
