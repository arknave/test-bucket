var express = require('express');
var http = require('http');
var stylus = require('stylus');
var mongo = require('mongodb'),
  Server = mongo.Server, 
  Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('test', server, {safe:false});

db.open(function(err, db) {
  if(!err) {
    db.createCollection('test', function(err,collection) {
        db.close();
    });
  }
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
  db.open(function(err, db) {
    if(!err){
      db.collection('test', function(err, collection){
        var tournament = {'tournname' : req.body.tname, 'tournyear' : req.body.tyear, 'tourndifficulty' : req.body.diff};
        collection.insert(tournament);
        collection.find().toArray(function(err, docs) {
          docs.forEach(function(doc) {
            console.log(doc.tournname);
            console.dir(doc);
          });
        });
      });
    }
    else{
      console.log(err);
    }
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
 
var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});
