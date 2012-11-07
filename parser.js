var exec = require('child_process').exec
var path = require('path');
var fs = require('fs');

exports.parse = function(filename, encoding){
  fs.readFile(__dirname + '/' + filename, encoding, function(err, data){
    if (err) throw err;
    lines = data.split("\n");
    var bonus = false;
    for(line in lines){
      var cur = lines[line];
      var isBonus = cur.match(/bonuse?s?/gi);
      if(isBonus!=null && isBonus!= undefined){
        bonus = true;
      }
      var tossup = cur.match(/(\d{1,2})\.?\s?([\s\S]+)/i);
      var answer = cur.match(/ANSWER:\s?([\s\S]+)/i);
      var bonuspart = cur.match(/\[10\]\s?([\s\S]+)/i);
      if(!bonus){
        if(tossup !=null && tossup != undefined){
          console.log(tossup[1]+" "+tossup[2]);
        }
        if(answer !=null && answer != undefined){
          console.log(answer[1]);
        }
      }
      if(bonus){
        if(tossup !=null && tossup != undefined){
          console.log(tossup[1]+" "+tossup[2]);
        }
        if(bonuspart !=null && bonuspart != undefined){
          console.log(bonuspart[1]);
        }
        if(answer !=null && answer != undefined){
          console.log(answer[1]);
        }
      } 
    } 
  });
}

exports.convert = function(fp, callback){
  exec('abiword -t txt '+__dirname+'/'+fp, function(){
    callback();
  });
}

exports.convertdir = function(path) {
  fs.readdir(__dirname + path , function(err, files){
    console.log(files);
    for(file in files){
      var cur = files[file];
      var convert = exec('abiword -t txt'+__dirname+path+'//"'+cur+'"');
      cur = cur.substring(0, cur.length-3);
      cur += 'txt';
      console.log(cur);
    }
  });
}
