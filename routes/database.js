var elastical = require('elastical'),
  client = new elastical.Client();

exports.index = function(req, res){
  var data = JSON.parse(req.body.data);
  data.forEach(function(d){
    d.forEach(function(f){
       client.index('questions', req.params.type, f, function(err, res){
        if(err) throw err;
      }); 
    });
  });
  res.send('mission complete');
};

exports.search = function(req, res){
  console.log(req.query.query);
  client.search({query: req.query.query}, function (err, results, fullres){
    res.send(results);
  });
};
