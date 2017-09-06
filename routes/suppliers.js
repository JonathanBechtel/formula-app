var app = require('express');
var router = app.Router();

router.get('/suppliers', function(req, res){
  res.render('suppliers', {
    title: 'Suppliers',
    description: `Source Ingredients and Find A Manufacturer For Your Project`,
    ID: 'suppliers',
    keywords: 'ingredient suppliers, dietary supplement manufacturers, dietary supplement industry',
    user: req.user,
    loggedIn: req.isAuthenticated()
  });
});

module.exports = router;
