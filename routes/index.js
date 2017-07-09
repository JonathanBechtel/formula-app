var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
      title: 'The Formula Generator',
      description: 'Easily manage and store your supplement formulas',
      ID: 'home',
      keywords: 'formula generator, supplement analyzer, formula management',
      user: req.user,
      loggedIn: req.isAuthenticated()
    });
  });

router.get('/users/:username', function(req, res) {
    res.render('index', {
      title: 'The Formula Generator',
      description: 'Easily manage and store your supplement formulas',
      ID: 'home',
      keywords: 'formula generator, supplement analyzer, formula management',
      user: req.user,
      loggedIn: req.isAuthenticated()
    });
  });

module.exports = router;
