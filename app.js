var express = require('express');

var app = express();

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.logger());

app.get('/', function(req, res) {
  res.render('index.jade', {team: "Moscow 5", losers: "TSM"}); 
});

app.get('/:url', function(req, res) {
  return res.render('index.jade', {team:"Moscow 5", losers: req.params.url});
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});
