var exec = require('child_process').exec
var path = require('path');
var fs = require('fs');
var http = require('http');

exports.parse = function(filename, encoding, pname, db, callback){
  var tupray = [];
  var bnsray = [];
  fs.readFile(__dirname + '/' + filename, encoding, function(err, data){
    if (err) throw err;
    lines = data.split("\n");
    var bonus = false;
    var tup = {'pack': pname[0], 'tmt' : pname[1], 'subj': 0};
    var bns = {'pack': pname[0], 'tmt' : pname[1], 'subj': 0};
    var partcntr = 1;
    for(line in lines){
      var cur = lines[line];
      var isBonus = cur.match(/bonuse?s?/gi);
      if(isBonus!=null && isBonus!= undefined){
        bonus = true;
      }
      var tossup = cur.match(/^(\d{1,2})\.?\s?([^\r\n]+)/i);
      var answer = cur.match(/^[\s\w]*ANSWER[\s\w]*:?\s?([^\r\n]+)$/i);
      var bonuspart = cur.match(/\[10\]\s+?([^\r\n]+)/i);
      if(!bonus){
        if(tossup !== null && tossup !== undefined){
          tup['num'] = parseInt(tossup[1]);
          tup['txt'] = tossup[2];
        }
        if(answer !== null && answer !== undefined){ 
          tup['ans'] = answer[1]; //add mongodb
          tupray.push(tup);
          //console.log(tup);
          /*db.tossup.insert(tup);
          var options = {
            host: 'localhost',
            port: 9200,
            path: '/questions/tossup',
            method: 'POST'
	  };

	  var req = http.request(options, function(res) {
	    console.log('STATUS: ' + res.statusCode);
	    console.log('HEADERS: ' + JSON.stringify(res.headers));
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
	      console.log('BODY: ' + chunk);
	    });
	  });

	  // write data to request body
	  req.write(JSON.stringify(tup));
          req.end();*/
          tup = {'pack': pname[0], 'tmt' : pname[1], 'subj': 0};
        }
      }
      if(bonus){
        if(tossup !== null && tossup !== undefined){
          bns['num'] = parseInt(tossup[1]);
          bns['txt'] = tossup[2];
        }
        if(bonuspart !== null && bonuspart !== undefined){
          bns['part'+partcntr] = bonuspart[1];
        }
        if(answer !== null && answer !== undefined){
          bns['ans'+partcntr] = answer[1];
	  //add mongodb
          partcntr++;
          if(partcntr === 4){
            bnsray.push(bns);
            //console.log(bns);
            
            /*db.bonus.insert(bns);
            var options = {
	      host: 'localhost',
	      port: 9200,
	      path: '/questions/bonus',
	      method: 'POST'
	    };

	    var req = http.request(options, function(res) {
	      console.log('STATUS: ' + res.statusCode);
	      console.log('HEADERS: ' + JSON.stringify(res.headers));
	      res.setEncoding('utf8');
	      res.on('data', function (chunk) {
	      	console.log('BODY: ' + chunk);
	      });
	    });

	    // write data to request body
	    req.write(JSON.stringify(bns));
            req.end();*/
            bns = {'pack': pname[0], 'tmt' : pname[1], 'subj': 0};
            partcntr = 1;
          }
        }
      }
    }
    if(callback && typeof(callback) === 'function'){
        callback([tupray, bnsray]);
      }
  });
}

exports.zipconv = function(fp, db, callback){
  var AdmZip = require('adm-zip'),
    zip = new AdmZip(fp[0]),
    zipEntries = zip.getEntries(),
    path = require('path'),
    num = zipEntries.length,
    ret = [[],[]];

  zipEntries.forEach(function(zipEntry){
    if(path.extname(zipEntry.entryName) === '.doc'){
      zip.extractEntryTo(zipEntry.entryName, __dirname + "/queue", true, true); 
      exec('abiword -t txt ' + __dirname + '/queue/"' + zipEntry.entryName+'"', function(){
        exports.parse('queue/'+zipEntry.entryName.substring(0, zipEntry.entryName.length-3)+'txt', "utf8", [zipEntry.name, fp[1]], db, function(ray){
          num--;
          ray[0].forEach(function(t){
            ret[0].push(t);
          });
          ray[1].forEach(function(t){
            ret[1].push(t);
          });
          if(num === 0) {
            if(callback && typeof(callback) === 'function'){
              callback(ret);
            }
          }
        });
      });
    }
  });
}
