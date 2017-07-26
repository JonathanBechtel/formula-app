var app      = require('express');
var router   = app.Router();
var formulas = require('../../data/formula.json');

router.get('/api/formula', function(req, res){
  res.json(formulas);
});

router.post('/api/formula', function(req, res){
  formulas.push(req.body);
  res.json(formulas);
});

router.delete('/api/formula/:id', function(req, res) {
  formulas.splice(req.params.id, 1);
  res.json(formulas);
});

module.exports = router;
