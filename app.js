var express = require('express');
var http = require('http');
var stylus = require('stylus');
var app = express();
var db = {'arnav': 'sastry', 'ying': 'roo'};

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.logger());
app.use(express.bodyParser({uploadDir:'./uploads'}));


var exec = require('child_process').exec, child;

var text, err;

child = exec('pwd', function(error, stdout, stderr){
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  text = stdout;
  err = stderr;
});

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
