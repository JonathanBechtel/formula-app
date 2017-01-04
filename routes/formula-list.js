var app = require('express');
var router = app.Router();

router.get('/formula-list', function(req, res){
  var db = req.db;
  var collection = db.get('formulas');
  collection.find({}, {}, function(e, docs){
    res.render('formula-list', {
      formulas: docs,
      title: 'Your Formulas',
      description: `List of saved user formulas from the formula generator`,
      ID: 'formula-list',
      keywords: 'formula generator, health kismet, nutraceutical formula builder'
    });
  });
});

module.exports = router;
