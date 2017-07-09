var app = require('express');
var router = app.Router();
var data = require('../data/formula.json');

router.get('/formula', function(req, res){
  data.length = 0;
  res.render('formula', {
    project: null,
    title: 'The Formula Builder',
    description:  'Build and manage nutraceutical formulas',
    ID: 'formula',
    keywords: 'formula builder, formula analyzer, nutraceutical supplement analysis',
    user: req.user,
    loggedIn: req.isAuthenticated()
  });
});

router.get('/users/:username/formula', function(req, res){
  data.length = 0;
  res.render('formula', {
    project: null,
    title: 'The Formula Builder',
    description:  'Build and manage nutraceutical formulas',
    ID: 'formula',
    keywords: 'formula builder, formula analyzer, nutraceutical supplement analysis',
    user: req.user,
    loggedIn: req.isAuthenticated()
  });
});

module.exports = router;
