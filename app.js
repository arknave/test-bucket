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
  difficulty: Number,
  packet: {
    tossup: {	
      subject: String, 
      idTournament: Number,
      packetName: String, 
      tossupNumber: Number,
      tossupText: String,
      tossupAnswer: String
      },
    bonus: {
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
      }
   }
})
var tournament = db.model('tournament', tournamentSchema);


app.get('/', function(req, res){
  res.render('index');
});

app.post('/upload', function(req,res){
  var parser = require('./parser.js');
  parser.convert(req.files.uploadfile.path, function(){
    parser.parse(req.files.uploadfile.path+".txt", 'utf8');
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
});

app.get('/client.js', function(req,res){
  res.sendfile(__dirname + '/client.js');
});

app.get('/public/images/:image', function(req,res){
  res.sendfile(__dirname + '/public/images/'+req.params.image);
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});
