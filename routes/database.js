ElasticSearchClient = require('elasticsearchclient');

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

exports.search = function(req, res){
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
            ][req.query.loc],
            query: req.query.query, 
            default_operator: "AND",
            }
        },
        filter : {
          and : [
            {  
              range: {
                "tmt.diff" : {gte: req.query.diff[0], lte: req.query.diff[1]}
              }
            },
          ]  
        },
      },
    },
    from: req.query.from,
    size: req.query.size,
  };
  console.log(req.query.from);  
  if (req.query.subj.length > 1) {
    qryObj.query.filtered.filter.and.push({terms: {subj: req.query.subj}});
  }
  esc.search('qbdb', ['', 'tossup', 'bonus'][req.query.type], qryObj)
    .on('error', function(err){
      res.send(500, err);
    })
    .on('data', function(data){
      res.send(data);
    })
    .exec();
};

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
