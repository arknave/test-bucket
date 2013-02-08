var express = require('express');
var http = require('http');
var stylus = require('stylus');
var path = require('path');

var db = require('mongo-lazy').open({
    db: 'test',
    host: 'localhost',
    port: 27017,
});

var app = express();

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.configure(function(){
  app.use(express.logger());
  app.use(express.bodyParser({uploadDir:'./uploads'}));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res){
  res.render('index');
});

app.post('/upload', function(req,res){
  parser = require('./parser.js');
  var tournament = {'name' : req.body.tname, 'year' : req.body.tyear,   'diff' : req.body.diff};
  parser.zipconv([req.files.zip.path, tournament], db, function(p){
    /*res.render('upload', {tup: JSON.stringify(p[0], null, '\t'), 
                          bns: JSON.stringify(p[1], null, '\t')
                         });*/
    res.send(p);
  });
});

app.get('/upload', function(req, res){
  res.render('upload'); 
});

app.get('/search', function(req,res){
  res.render('search');
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Listening on " + port);
});
