var express = require('express');
var http = require('http');
var stylus = require('stylus');
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'test');
var app = express();

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.logger());
app.use(express.bodyParser({uploadDir:'./uploads'}));

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("mission accomplished");
});

var exec = require('child_process').exec, child;

var text, err;

app.get('/', function(req, res){
  res.render('index');
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

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});
