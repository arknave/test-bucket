var exec = require('child_process').exec
var path = require('path');
var fs = require('fs');

exports.parse = function(filename, encoding, pname, db){
  fs.readFile(__dirname + '/' + filename, encoding, function(err, data){
    if (err) throw err;
    lines = data.split("\n");
    var bonus = false;
    var tup = {'pack': pname};
    var bns = {'pack': pname};
    var partcntr = 1;
    for(line in lines){
      var cur = lines[line];
      var isBonus = cur.match(/bonuse?s?/gi);
      if(isBonus!=null && isBonus!= undefined){
        bonus = true;
      }
      var tossup = cur.match(/^(\d{1,2})\.?\s?([^\r\n]+)/i);
      var answer = cur.match(/^\w*ANSWER\w*:?\s?([^\r\n]+)$/i);
      var bonuspart = cur.match(/\[10\]\s+?([^\r\n]+)/i);
      if(!bonus){
        if(tossup !== null && tossup !== undefined){
          tup['num'] = parseInt(tossup[1]);
          tup['txt'] = tossup[2];
        }
        if(answer !== null && answer !== undefined){ tup['ans'] = answer[1]; //add mongodb
          console.log(tup);
          db.tossup.insert(tup);
          tup = {'pack': pname};
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
            console.log(bns);
            db.bonus.insert(bns);
            bns = {'pack': pname};
            partcntr = 1;
          }
        }
      }

    } 
  });
}

exports.zipconv = function(fp, db){
  var AdmZip = require('adm-zip');
  var zip = new AdmZip(fp);
  var zipEntries = zip.getEntries();
  var path = require('path');
  zipEntries.forEach(function(zipEntry){
    if(path.extname(zipEntry.entryName) === '.doc'){
      zip.extractEntryTo(zipEntry.entryName, __dirname + "/queue", true, true); 
      console.log(zipEntry.name);
      exec('abiword -t txt ' + __dirname + '/queue/"' + zipEntry.entryName+'"', function(){
        return exports.parse('queue/'+zipEntry.entryName.substring(0, zipEntry.entryName.length-3)+'txt', "utf8", zipEntry.name, db);
      });
    }
  });
}

exports.convertdir = function(pth) {
  fs.readdir(__dirname + pth , function(err, files){
    console.log(files);
    for(file in files){
      var cur = files[file];
      var convert = exec('abiword -t txt '+path.join(__dirname, pth, cur), function(){
        console.log('abiword -t txt '+path.join(__dirname,pth,cur));
      });
      //parse(__dirname + path +'/'+ cur, 'utf8');
    }
  });
}
