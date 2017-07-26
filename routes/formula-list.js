var app = require('express');
var router = app.Router();
var data = require('../data/formula.json');
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

//retrieves all formulas and displays them
router.get('/users/:username/formula-list', function(req, res){
  var db = req.db.collection('users');
  db.find({"_id": new ObjectID(req.user.id)}, {formulas: 1, _id: 0}).toArray(function(e, docs){
    if (e) {
      throw e;
    } else {
      res.render('formula-list', {
        formulas: docs[0].formulas,
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

//for formulas new users make that aren't signed in
router.post('/formula-list', function(req, res){
    var db = req.db.collection('users');
    var formula = data;
    db.findOneAndUpdate({"_id": req.user.id }, {
      $push: {
        formulas: {
          "f_id": new ObjectID(),
          "name": req.body.name,
          "description": req.body.description,
          "ingredients": data
        }
      }
    });
    data.length = 0;
});

//when signed in users make an update  to an existing formula
router.post('/formula-list/:id', function(req, res){
    var db = req.db.collection('users');
    var f_id = new ObjectID(req.params.id);
    var id = new ObjectID(req.user.id);

    var formula = data;

    db.updateOne({"_id": id, "formulas.f_id": f_id}, {
      $set: {
      "formulas.$.name": req.body.name,
      "formulas.$.description": req.body.description,
      "formulas.$.ingredients": formula
      }}, function(err, r){
        assert.equal(null, err);
        assert.equal(1, r.matchedCount);
        assert.equal(1, r.modifiedCount);
        req.db.close();
    });
    data.length = 0;
});

//initiated when you hit the 'Delete' button for a formula at /users/:username/formula-list
router.delete('/formula-list/:id', function(req, res){
  var db = req.db.collection('users');
  var f_id = new ObjectID(req.params.id);
  db.updateOne({"_id": new ObjectID(req.user.id)}, { $pull: {
    "formulas": {"f_id": f_id}
    }}, function(err, r){
                 assert.equal(null, err);
                 assert.equal(1, r.modifiedCount);
                 req.db.close();
               });
  res.end();
});

module.exports = router;
