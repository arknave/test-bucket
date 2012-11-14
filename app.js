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

var text, err; 

var tournamentSchema = new mongoose.Schema({
  name: String,
  year: Number,
  difficulty: Number
})
var tournament = db.model('tournament', tournamentSchema);

var tossupSchema = new mongoose.Schema({
  subject: String, 
  idTournament: Number,
  packetName: String, 
  tossupNumber: Number,
  tossupText: String,
  tossupAnswer: String
})

var bonusSchema = new mongoose.Schema({
  subject: String, 
  idTournament: Number,
  packetName: String, 
  bonusNumber: Number,
  bonusPreamble: String,
  bonusQuestion1: String, 
  bonusAnswer1: String, 
  bonusQuestion2: String, 
  bonusAnswer2: String,
  bonusQuestion3: String, 
  bonusAnswer3: String
})

var bonus = db.model('bonus',bonusSchema); 

app.get('/', function(req, res){
  res.render('index');
});

app.post('/upload', function(req,res){
  var temp = new tournament({name: req.files.tname, year: req.files.tyear, difficulty: req.files.diff});
  temp.save(function (err) {
  if (err) return handleError(err);
  // saved!
    })
  tournament.findOne({ 'name': 'ACF Fall' }, function      (err, person) {
  if (err) return handleError(err);
  console.log('%s is a tournament.', tournament.dname)
    })
  console.log(req.body);
  console.log(req.files);
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
