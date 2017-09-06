var app = require('express');
var router = app.Router();

router.get('/work', function(req, res){
  res.render('work', {
    title: 'Work With Us',
    description: 'Work With the consulting arm of Health Kismet, Nutraceutical Pro',
    ID: 'suppliers',
    keywords: 'dietary supplement consulting, dietary supplement formulation, dietary supplement project management',
    user: req.user,
    loggedIn: req.isAuthenticated()
  });
});

module.exports = router;
