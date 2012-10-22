var express = require('express');
var http = require('http');
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

app.get('/', function(req, res){
  res.render('index.jade');
});

app.get('/search/', function(req,res){
  res.render('search.jade');
});

app.post('/', function(req, res, next){
  // the uploaded file can be found as `req.files.image` and the
  // title field as `req.body.title`
  res.send(req.body.title);
  res.redirect('/');
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});


