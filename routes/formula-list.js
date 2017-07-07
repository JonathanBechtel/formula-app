var app = require('express');
var router = app.Router();
var data = require('../data/formula.json');
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

//retrieves all formulas and displays them
router.get('/formula-list', function(req, res){
  var db = req.db.collection('formulas');
  db.find({}).toArray(function(e, docs){
    if (e) {
      throw e;
    } else {
      res.render('formula-list', {
        formulas: docs,
        title: 'Your Formulas',
        description: `List of saved user formulas from the formula generator`,
        ID: 'formula-list',
        keywords: 'formula generator, health kismet, nutraceutical formula builder',
        user: req.user,
        loggedIn: req.isAuthenticated()
      });
    }
  });
});

router.post('/formula-list', function(req, res){
    var db = req.db.collection('formulas');
    var formula = data;

    db.insertOne({
      "name": req.body.name,
      "description": req.body.description,
      "formula": formula
    }, function(err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
        req.db.close();
    });
    data.length = 0;
});


router.post('/formula-list/:id', function(req, res){
    console.log(req.params);
    var db = req.db.collection('formulas');
    var id = new ObjectID(req.params.id);
    var formula = data;

    db.updateOne({"_id": id}, { $set: {
      "name": req.body.name,
      "description": req.body.description,
      "formula": formula
    }}, function(err, r){
        assert.equal(null, err);
        assert.equal(1, r.matchedCount);
        assert.equal(1, r.modifiedCount);
        req.db.close();
    });
    data.length = 0;
});

//initiated when you hit the 'Delete' button for a formula
//on /formula-list
router.delete('/formula-list/:id', function(req, res){
  var db = req.db.collection('formulas');
  var id = new ObjectID(req.params.id);
  var query = { "_id": id };
  db.deleteOne(query, function(err, r){
    assert.equal(null, err);
    assert.equal(1, r.deletedCount);
    req.db.close();
  });
  res.end();
});

//initiated when you hit the 'show' button for a formula
//on /formula-list
router.get('/formula/:id', function(req, res){
  data.length = 0;
  var db = req.db.collection('formulas');
  var id = new ObjectID(req.params.id);
  var query = {"_id": id};
  db.find(query).toArray(function(e, doc){
    if (e) {
      throw e;
    } else {
      console.log(doc);
      doc[0].formula.forEach(function(item){
        data.push(item);
      });
      res.render('formula', {
        project: doc[0],
        title: 'Modify and edit your formula',
        description:  'Build and manage nutraceutical formulas',
        ID: 'formula',
        keywords: 'formula builder, formula analyzer, nutraceutical supplement analysis',
        user: req.user,
        loggedIn: req.isAuthenticated()
        });
      }
    });
  });

module.exports = router;
