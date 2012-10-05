var express = require('express');

var app = express.createServer(express.logger());

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.logger());

app.get('/', function(request, response) {
  response.render('index.jade'); 
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
