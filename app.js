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
  parser.zipconv(req.files.uploadfile.path, db);
  var tournament = {'tournname' : req.body.tname, 'tournyear' : req.body.tyear, 'tourndifficulty' : req.body.diff};
  db.tournament.insert(tournament);
  db.tournament.findAll({}, function(err, it){
    console.log('It: ', + err||it, '\n');
  });
  res.redirect('back');
});

app.get('/upload', function(req, res){
  res.render('upload');
});

app.get('/search/', function(req,res){
  res.render('search', { scripts: ['client.js']});
});

app.get('/search/:query?', function(req,res) {
  var query = req.params.query;
  return db.query;
});

app.get('/client.js', function(req,res){
  res.sendfile(__dirname + '/client.js');
});

app.get('/upload', function(req,res) {
  res.render('upload');
  res.redirect('/search/');
});
 
var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Listening on " + port);
});
