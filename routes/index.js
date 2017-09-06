var express   = require('express');
var router    = express.Router();
var ObjectID  = require('mongodb').ObjectID;
var assert    = require('assert');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
      title:       'The Formula Generator',
      description: 'Easily manage and store your supplement formulas',
      ID:          'home',
      keywords:    'formula generator, supplement analyzer, formula management',
      user:        req.user,
      loggedIn:    req.isAuthenticated()
    });
  });

router.get('/users/:username', function(req, res) {
  if (req.session.temp_formula) {
    var db = req.db.collection('users');
    var id = new ObjectID(req.user.id);
    db.update({"_id": id},
      {
        $push: {
          formulas: {
            "f_id"          : new ObjectID(),
            "name"          : req.session.temp_formula.name,
            "description"   : req.session.temp_formula.description,
            "timeframe"     : req.session.temp_formula.timeframe,
            "numContainer"  : req.session.temp_formula.numContainer,
            "price"         : req.session.temp_formula.price,
            "form"          : req.session.temp_formula.form,
            "servings"      : req.session.temp_formula.servings,
            "ingredients"   : req.session.temp_formula.ingredients
            }
          }
        }, function(err, r) {
          if (err) {throw err;}
      });
      delete req.session.temp_formula;
    }
    res.redirect('/users/:username/formula-list');
  });

module.exports = router;
