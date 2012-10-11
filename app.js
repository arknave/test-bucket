var express = require('express');
var app = express();

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.logger());

var exec = require('child_process').exec, child;

var text, err;

child = exec('ssh -V', function(error, stdout, stderr){
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  text = stdout;
  err = stderr;
});

app.get('/', function(req, res) {
  return res.render('index.jade', {team: "Moscow 5", losers: "TSM", text: " out "+text+" err "+err}); 
});

app.get('/:url', function(req, res) {
  return res.render('index.jade', {team:"Moscow 5", losers: req.params.url, text: 'guhguh'});
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});
