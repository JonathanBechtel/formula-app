var app = require('express');
var router = app.Router();

router.get('/formula', function(req, res){
  res.render('formula', {
    title: 'The Formula Builder',
    description:  'Build and manage nutraceutical formulas',
    ID: 'formula',
    keywords: 'formula builder, formula analyzer, nutraceutical supplement analysis'
  });
});

module.exports = router;
