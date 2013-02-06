var express = require('express');
var http = require('http');
var stylus = require('stylus');

var db = require('mongo-lazy').open({
    db: 'test',
    host: 'localhost',
    port: 27017,
});

var app = express();

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.logger());
app.use(express.bodyParser({uploadDir:'./uploads'}));

app.get('/', function(req, res){
  res.render('index');
});

app.post('/upload', function(req,res){
  parser = require('./parser.js');
  var tournament = {'name' : req.body.tname, 'year' : req.body.tyear,   'diff' : req.body.diff};
  parser.zipconv([req.files.uploadfile.path, tournament], db, function(p){
    res.render('upload', {tup: JSON.stringify(p[0], null, '\t'), 
                          bns: JSON.stringify(p[1], null, '\t')
                         });
  });
});

app.get('/upload', function(req, res){
  res.render('upload', {tup: 'tossups goes here', bns: 'bonus goes here'});
});

app.get('/search/', function(req,res){
  res.render('search', { scripts: ['client.js']});
});

app.get('/search/:query?', function(req,res) {
  var query = req.params.query;
});

app.get('/client.js', function(req,res){
  res.sendfile(__dirname + '/client.js');
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Listening on " + port);
});
