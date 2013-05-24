var express = require('express');
var path = require('path');
var dbroute = require('./routes/database');
var app = express();
var jade = require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.configure(function(){
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.logger());
  app.use(express.bodyParser({uploadDir:'./uploads'}));
});

app.get('/', function(req, res){
  res.render('index');
});

app.post('/upload/', function(req,res){
  parser = require('./parser.js');
  var tournament = {'name' : req.body.tname, 'year' : req.body.tyear,   'diff' : req.body.diff};
  parser.zipconv([req.files.zip.path, tournament], function(err, p){
    if(err){ console.log(err); res.send(500, err); }
    res.send(p);
  });
});

app.get('/upload/', function(req, res){
  res.render('upload'); 
});

app.get('/search/:query?', function(req,res){
  res.render('search');
});

app.post('/database/:type/index', dbroute.index);
app.get('/database/search', dbroute.search);
app.post('/database/update', dbroute.update);
app.get('/database/text', dbroute.text);

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Listening on " + port);
});
