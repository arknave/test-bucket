var express = require('express');
var http = require('http');
var stylus = require('stylus');

var mongo = require('mongodb'),
  Server = mongo.Server, 
  Db = mongo.Db;


var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('test', server);

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
 /*var temp = new tournament({name: req.body.tname, year: req.body.tyear, difficulty: req.body.diff}); 
  temp.save(function (err) {
    if (err) return handleError(err);
    console.log(temp);
  tournament.create({
    name: req.body.tname, 
    year: req.body.tyear,
    difficutly: req.body.diff
  }, function(err) {
      if(err)return handleError(err);
    }
  );

/*Person.findOne({}, 'name', function (err, tournament) {
    if (err) return handleError(err);
    console.log('%s is a tournament.',tournament.name);
    )};
  console.log(req.body);
  console.log(req.files);
  console.log(req.files.uploadfile.path); */
  //parser.zipconv(req.files.uploadfile.path, function() {});
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


