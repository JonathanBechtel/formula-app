var app = require('express');
var router = app.Router();
var data = require('../data/formula.json');
var ObjectID = require('mongodb').ObjectID;

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

//initiated when you hit the 'show' button for a formula
//on /formula-list
router.get('/users/:username/formula/:id', function(req, res){
  data.length = 0;
  var db = req.db.collection('users');
  var id = new ObjectID(req.params.id);
  var pointer = {"formulas.$": 1, "_id": 0};
  db.aggregate([
    {$match: {"formulas.f_id": id}},
    {$unwind: "$formulas"},
    {$match: {"formulas.f_id": id}},
    {$project : {"formulas": 1, "_id": 0}}
  ]).toArray(function(e, doc){
    if (e) {
      throw e;
    } else {
      doc[0].formulas.ingredients.forEach(function(item){
        data.push(item);
      });
      res.render('formula', {
        project: doc[0].formulas,
        title: 'Modify and edit your formula',
        description:  'Build and manage nutraceutical formulas',
        ID: 'formula-saved',
        keywords: 'formula builder, formula analyzer, nutraceutical supplement analysis',
        user: req.user,
        loggedIn: req.isAuthenticated()
        });
      }
    });
  });

module.exports = router;
