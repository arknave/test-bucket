var exec = require('child_process').exec
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
      if(!bonus){
         var tossup = cur.match(/(\d{1,2})\.\s?([\s\S]+)/i);
         var answer = cur.match(/ANSWER:([\s\S]+)/i);
         if(tossup !=null && tossup != undefined){
           console.log(tossup);
         }
         if(answer !=null && answer != undefined){
           console.log(answer);
         }
      }
      
    } 
  });
}

fs.readdir('Packets', function(err, files){
  console.log(files);
  for(file in files){
    var cur = files[file];
    var convert = exec('abiword -t txt Packets/"'+cur+'"');
    cur = cur.substring(0, cur.length-3);
    cur += 'txt';
    console.log(cur);
    parse( __dirname + '/Packets/'+cur, 'utf8');
  }
});
