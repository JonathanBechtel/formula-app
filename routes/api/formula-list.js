var app = require('Express');
var router = app.Router();
var data = require('../../data/formula.json');

router.post('/api/formula-list', function(req, res){
    var db = req.db;

    var name = "formula name";
    var formula = data;

    var collection = db.get('formulas');

    collection.insert({
      "name": name,
      "formula": formula
    }, function(err, doc){
      if (err) {
        res.send("There was a problem sending information to the database.");
      } else {
        res.redirect('/formula');
      }
    });
    formula.length = 0;
});

module.exports = router;
