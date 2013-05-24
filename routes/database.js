ElasticSearchClient = require('elasticsearchclient');
var fs = require('fs');
var servopts = {
  host: 'localhost',
  port: 9200,
  secure: false
};

var esc = new ElasticSearchClient(servopts);

exports.index = function(req, res){
  var data = JSON.parse(req.body.data);
  data.forEach(function(d){
    d.forEach(function(f){
      esc.index('questions', req.params.type, f)
        .on('error', function(err) {
          throw err;
        })
        .exec(); 
    });
  });
  res.send('mission complete');
};

var search = function(req, res, cb){
  var diff = [
    req.query.diff ? req.query.diff[0] : 1,
    req.query.diff ? req.query.diff[1] : 9,
  ];
  var query = req.query.query || "*";
  var qryObj = 
  {
    query : {
      filtered: {
        query: {
          query_string: { 
            fields: [
              ['txt', 'ans*', 'part*'],
              ['txt', 'part*'],
              ['ans*']
            ][req.query.loc || 0],
            query: query, 
            default_operator: "AND",
            }
        },
        filter : {
          and : [
            {  
              range: {
                "tmt.diff" : {gte: diff[0], lte: diff[1]}
              }
            },
          ] 
        },
      },
    },
    from: req.query.from || 0,
    size: req.query.size || 10,
  };
  var subj = req.query.subj || [];
  if (subj.length > 1) {
    qryObj.query.filtered.filter.and.push({terms: {subj: subj}});
  }
  esc.search('qbdb', ['', 'tossup', 'bonus'][req.query.type || 0], qryObj)
    .on('error', function(err){
      cb(err);
    })
    .on('data', function(data){
      cb(null, data);
    })
    .exec();
};

exports.search = function(req, res){
  search(req, res, function(err, data){
    if(err !== null){
      res.send(500, err);
    }
    res.json(data);
  });
}

exports.update = function(req, res){
  var q = req.body.q._source;
  q.subj = req.body.newsubj;
  esc.update('qbdb', req.body.q._type, req.body.q._id, {
    script: "ctx._source.subj = ns",
    params: {
      ns: req.body.newsubj,
    }
  })
    .on('error', function(err){
      res.send(500, err);
    })
    .on('data', function(data){
      res.send(data);
    })
    .exec();
}

exports.text = function(req, res){
  req.query.from = 0;
  req.query.size = 40000;
  search(req, res, function(err, data){
    if(err !== null){
      res.send(500, err);
    }
    data = (typeof data === 'string') ? JSON.parse(data) : data;
    console.log(data);
    if(data.status){
      res.send(500, data);
      return;
    }
    var stream = fs.createWriteStream('results.txt');
    for(tup in data.hits.hits){
      console.log(tup);
      ques = data.hits.hits[tup]._source;
      stream.write(ques.tmt.name+" - " + ques.tmt.year +" - "+ques.pack+"\n");
      stream.write(ques.txt+"\n");
      stream.write(ques.ans+"\n\n");
    }
    stream.end('', 'utf8', function(){
      res.download('results.txt');
    });
  });
}
