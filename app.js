var express = require('express');
var app = express();

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

/* app.get('/', function(req, res) {
  return res.render('index.jade', {team: "Moscow 5", losers: "TSM", text: " out "+text+" err "+err}); 
}); 

app.post('/upload', function(req,res) {
     console.log(req.files.uploadfile);
     console.log(req.files.uploadfile.name);
});

app.get('/:url', function(req, res) {
  return res.render('index.jade', {team:"Moscow 5", losers: req.params.url, text: 'guhguh'});
});  */

app.get('/', function(req, res){
  res.render('index.jade');
});

app.post('/', function(req, res, next){
  // the uploaded file can be found as `req.files.image` and the
  // title field as `req.body.title`
  res.send(req.body.title);
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});


