var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');

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
  if (req.session.temp_formula) {
    var db = req.db.collection('users');
    var id = new ObjectID(req.user.id);
    console.log("id looks like: ", id);
    db.update({"_id": id},
      {
        $push: {
          formulas: {
            "f_id": new ObjectID(),
            "name": req.session.temp_formula.name,
            "description": req.session.temp_formula.description,
            "ingredients": req.session.temp_formula.ingredients
            }
          }
        }, function(err, r) {
          if (err) {throw err;}
      });
      delete req.session.temp_formula;
      console.log("The session after deleting temp_formula is: ", req.session);
    }
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
