var exec = require('child_process').exec
var path = require('path');
var fs = require('fs');

var parse = function(filename, encoding){
  fs.readFile(filename, encoding, function(err, data){
    if (err) throw err;
    lines = data.split("\n");
    var bonus = false;
    for(line in lines){
      var cur = lines[line];
      var isBonus = cur.match(/bonuse?s?/gi);
      if(isBonus!=null && isBonus!= undefined){
        bonus = true;
      }
      var tossup = cur.match(/(\d{1,2})\.\s?([\s\S]+)/i);
      var answer = cur.match(/ANSWER:\s?([\s\S]+)/i);
      var bonuspart = cur.match(/\[10\]\s?([\s\S]+)/i);
      if(tossup !=null && tossup != undefined){
        console.log(tossup[1]+" "+tossup[2]);
      }
      if(answer !=null && answer != undefined){
        console.log(answer[1]);
      }
      if(bonus){
        if(bonuspart !=null && bonuspart != undefined){
          console.log(bonuspart[1]);
        }
      } 
    } 
  });
}

var convertdir = function(path) {
  var validext = ['doc, docx, rtf']
  fs.readdir(__dirname + path , function(err, files){
    console.log(files);
    for(file in files){
      var cur = files[file];
      var valid = false;
      for(ext in validext){
        if(path.exitname(cur)==validext[ext]){
          valid = true;
          break;
        }
      }
      if ( !valid ) {
        return;
      }
      var convert = exec('abiword -t txt'+__dirname+path+'//"'+cur+'"');
      cur = cur.substring(0, cur.length-3);
      cur += 'txt';
      console.log(cur);
      //parse( __dirname + '/Packets/'+cur, 'utf8');
    }
  });
}

parse(__dirname + '/Packets/Stanford.txt', 'utf8');
