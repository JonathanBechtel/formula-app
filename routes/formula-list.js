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
    var ingredients = data;
    var name = req.body.name;
    var description = req.body.description;
    var numContainer = req.body.numContainer;
    var typeContainer = req.body.typeContainer;
    var price = req.body.price;
    var servings = req.body.servings;

    if (req.session.passport) {
      var db = req.db.collection('users');
      var id = new ObjectID(req.user.id);
      db.update({"_id": id},
        {
          $push: {
            formulas: {
              "f_id": new ObjectID(),
              "name": name,
              "description": description,
              "numContainer": numContainer,
              "typeContainer": typeContainer,
              "price": price,
              "servings": servings,
              "ingredients": ingredients
              }
            }
          }, function(err, r) {
            if (err) {throw err;}
        });
    } else {
      req.session.temp_formula = {};
      req.session.temp_formula.name = name;
      req.session.temp_formula.description = description;
      req.session.temp_formula.ingredients = ingredients;
      //data.length = 0; -- will look into;
      req.session.save(function(err){
        if(err) {
          throw err;
        }
      });
    }
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
