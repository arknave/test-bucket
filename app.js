var express = require('express');
var app = express();

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.logger());

var exec = require('child_process').exec, child;

var text, err;

child = exec('python --version', function(error, stdout, stderr){
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

var dropbox = document.getElementById("dropbox")

dropbox.addEventListener("dragenter", dragEnter, false);
dropbox.addEventListener("dragexit", dragExit, false);
dropbox.addEventListener("dragover", dragOver, false);
dropbox.addEventListener("drop", drop, false);

function dragEnter(evt) {
  evt.stopPropagation();
  evt.preventDefault();
}

function dragExit(evt) {
  evt.stopPropagation();
  evt.preventDefault();
}

function dragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
}

function drop(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files;
  var count = files.length;

  if(cout &gt; 0)
	handleFiles(files);
}

function handleFiles(files) {
  var file = files[0];

  document.getElementById("droplabel").innerHTML = "Processing " + file.name;

  var reader = new FileReader();

  reader.onload = handleReaderLoad;
  reader.readAsDataURl(file);
}

function handleReaderLoad(evt) {
  var img = document.getElementById("preview");
  img.src = evt.target.result;
}
