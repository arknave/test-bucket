var exec = require('child_process').exec
var path = require('path');
var fs = require('fs');
var http = require('http');

exports.parse = function(filename, encoding, pname, callback){
  var tupray = [];
  var bnsray = [];
  var num = 1;
  fs.readFile(__dirname + '/' + filename, encoding, function(err, data){
    if (err) throw err;
    lines = data.split("\n");
    var bonus = false;
    var tup = {'pack': pname[0], 'tmt' : pname[1], 'subj': [0]};
    var bns = {'pack': pname[0], 'tmt' : pname[1], 'subj': [0]};
    var partcntr = 1;
    
    for(line in lines){
      var cur = lines[line];
      var isBonus = cur.match(/bonuse?s?/gi);
      if(isBonus!=null && isBonus!= undefined){
        bonus = true;
        num = 1;
      }
      var tossup = cur.match(/^(\d{1,2})\.?\s?([^\r\n]+)/i);
      var answer = cur.match(/^[\s\w]*ANS?WE?[RY][\s\w]*:?\s?([^\r\n]+)$/i);
      var bonuspart = cur.match(/\[10\]?\s+?([^\r\n]+)/i);
      if(!bonus){
        if(tossup !== null && tossup !== undefined){
          tup['num'] = parseInt(tossup[1]);
          tup['txt'] = tossup[2];
        }
        if(answer !== null && answer !== undefined){ 
          if(!tup['txt']) { continue; }
          tup['ans'] = answer[1]; 
          if(tup['num'] !== num) { 
            console.log(tup);
            return callback('Skipped tossup '+num+' somewhere in '+ pname[0]);
          }
          num++;
          tupray.push(tup);
          //console.log(tup);
	      // write data to request body
          tup = {'pack': pname[0], 'tmt' : pname[1], 'subj': [0]};
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
          partcntr++;
          if(partcntr === 4){
            if(bns['num'] !== num) { 
              console.log(bns);
              return callback('Skipped bonus '+num+' somewhere in '+ pname[0]);
            }
            num++;
            bnsray.push(bns);
            //console.log(bns);
            bns = {'pack': pname[0], 'tmt' : pname[1], 'subj': [0]};
            partcntr = 1;
          }
        }
      }
    }
    if(callback && typeof(callback) === 'function'){
        callback(null, [tupray, bnsray]);
      }
  });
}

exports.zipconv = function(fp, callback){
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
        exports.parse('queue/'+zipEntry.entryName.substring(0, zipEntry.entryName.length-3)+'txt', "utf8", [zipEntry.name, fp[1]], function(err, ray){
          num--;
          ret[0].push(typeof(ray)==='undefined' ? 'error' : ray[0]);
          ret[1].push(typeof(ray)==='undefined' ? 'error' : ray[1]);
          if(num === 0) {
            if(err) {
              if(callback && typeof(callback) === 'function'){
                return callback(err);
              }
            }
            if(callback && typeof(callback) === 'function'){
              callback(null, ret);
            }
          }
        });
      });
    }
    else {
      num--;
    }
  });
}
