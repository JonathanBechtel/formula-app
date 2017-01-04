var app = require('express');
var router = app.Router();

router.get('/contact', function(req, res){
  res.render('contact', {
    title: 'Contact Us',
    description: `Get in touch with the people behind
     the Formula Generator`,
    ID: 'contact',
    keywords: 'formula generator contact, formula '
  });
});

module.exports = router;
