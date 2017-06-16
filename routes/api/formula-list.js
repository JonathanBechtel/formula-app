var app = require('Express');
var router = app.Router();
var assert = require('assert');
var data = require('../../data/formula.json');
var ObjectID = require('mongodb').ObjectID;

// used to submit the formula at /formula to database
// ajax call created on lines 21-28 at
// 'public/javascripts/formula-api.js'
router.post('/api/formula-list', function(req, res){
    console.log("The response was received 123");
    var db = req.db.collection('formulas');
    var formula = data;

    db.insertOne({
      "name": req.body.name,
      "description": req.body.description,
      "formula": formula
    }, function(err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
    });
    data.length = 0;
});

router.post('/api/formula-list/:id', function(req, res){
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

module.exports = router;
