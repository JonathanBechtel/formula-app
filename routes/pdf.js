var app = require('express');
var router = app.Router();
var ObjectID = require('mongodb').ObjectID;
var pdf =require('html-pdf');
var ejs = require('ejs');
var fs  = require('fs');

router.get('/formulas/:id/pdf', function(req, res){
  var db = req.db.collection('users');
  var id = new ObjectID(req.params.id);
  var pointer = {"formulas.$": 1, "_id": 0};
  db.aggregate([
    {$match: {"formulas.f_id": id}},
    {$unwind: "$formulas"},
    {$match: {"formulas.f_id": id}},
    {$project : {"formulas": 1, "_id": 0}}
  ]).toArray(function(e, doc){
    if (e) {
      throw e;
    } else {
      var html = null;
      ejs.renderFile('./views/pdf.ejs', {
        project: doc[0].formulas,
        title: 'Formula Info Report',
        description:  'PDF Report For Your Formula by Nutraceutical Pro',
        ID: 'pdf',
        keywords: 'PDF, PDF generator, Formula Info Report',
        user: req.user,
        loggedIn: req.isAuthenticated()
      }, function(err, results){
        if (err) {
          console.log(err);
          }
          html = results;
        });
        var options = { format: 'Letter' };
        var path = './public/pdf/formula-' + req.params.id + '.pdf';
        pdf.create(html, options).toStream(function(err, stream) {
          if (err) {
            return console.log(err);
          }
          if (stream) {
            stream.pipe(fs.createWriteStream(path));
            console.log("the pdf was streamed.");
            res.end();
          }
        });
      }
    });
  });

module.exports = router;
