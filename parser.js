var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var http = require('http');

function levendist(str1, i, len1, str2, j, len2) {
  if(len1 === 0){
    return len2;
  }
  if(len2 === 0) return len1;
  var cost = 0;
  if(str1[i] !== str2[j]){
     cost = 1;
  }
  var dist = Math.min(
    levendist(str1, i+1,len1-1, str2,j,len2)+1, 
    levendist(str1,i,len1,str2,j+1,len2-1)+1,
    levendist(str1,i+1,len1-1,str2,j+1,len2-1)+cost
  );
  return dist;
}

matchans = function(str){
  var n = levendist(str.substring(0,7), 0, 7, "ANSWER:", 0, 7);
  if(n < 3){
    var ret = [true, str, n];
    return ret;
  }
  else {
    return [false];
  }
}

/*
exports.parse = function(filename, encoding, pname, callback){
  var tupray = [];
  var bnsray = [];
  var num = 1;
  fs.readFile(__dirname + '/' + filename, encoding, function(err, data){
    if (err) throw err;
    lines = data.split("\n");
    var bonus = false;
    var tup = {'pack': pname[0], 'tmt' : pname[1], 'subj': 0};
    var bns = {'pack': pname[0], 'tmt' : pname[1], 'subj': 0};
    var  partcntr = 1;
    
    for(line in lines){
      var cur = lines[line];
      var isBonus = cur.match(/bonuse?s?/gi);
      if(isBonus!=null && isBonus!= undefined){
        bonus = true;
        num = 1;
      }
      var tossup = cur.match(/^(\d{1,2}|TB)\.?\s?([^\r\n]+)/i);
      var answer = matchans(cur);
      var bonuspart = cur.match(/\[10\]?\s+?([^\r\n]+)/i);
      if(!bonus){
        if(tossup !== null && tossup !== undefined){
          tup['num'] = tossup[1] === "TB" ? num : parseInt(tossup[1]);
          tup['txt'] = tossup[2];
        }
        if(answer[0]){
          if(!tup['txt']) { continue; }
          tup['ans'] = answer[1]; 
          console.log(tup);
          if(tup['num'] !== num && tup['num'] !== 'TB') { 
            return callback('Skipped tossup '+num+' somewhere in '+ pname[0]);
          }
          num++;
          tupray.push(tup);
          //console.log(tup);
          //write data to request body
          tup = {'pack': pname[0], 'tmt' : pname[1], 'subj': 0};
        }
      }
      if(bonus){
        if(tossup !== null && tossup !== undefined){
          bns['num'] = tossup[1]==="TB" ? num : parseInt(tossup[1]);
          bns['txt'] = tossup[2];
        }
        if(bonuspart !== null && bonuspart !== undefined){
          bns['part'+partcntr] = bonuspart[1];
        }
        if(answer[0]){
          bns['ans'+partcntr] = answer[1];
          partcntr++;
          if(partcntr === 4){
            console.log(bns);
            if(bns['num'] !== num && bns['num'] !== 'TB') { 
              return callback('Skipped bonus '+num+' somewhere in '+ pname[0]);
            }
            num++;
            bnsray.push(bns);
            //console.log(bns);
            bns = {'pack': pname[0], 'tmt' : pname[1], 'subj': 0};
            partcntr = 1;
          }
        }
      }
    }
    if(callback && typeof(callback) === 'function'){
        callback(null, [tupray, bnsray]);
      }
  });
}*/

var tossupHandler = function(pname){
  this.state = 'waiting'; // waiting, text, or answer
  this.txtregex = /^(\d{1,2})\.?\s?(.+)/i;
  this.reset = function(){
    this.ques = {
      pack: pname[0],
      tmt: pname[1],
      subj: 0,
    };
  }
  
  this.reset();
  this.genanswer = function() {
    var pos = this.ques.txt.toUpperCase().indexOf('ANSWER');
    if(pos > -1){
      this.ques.ans = this.ques.txt.substring(pos).trim();
      this.ques.txt = this.ques.txt.substring(0, pos).trim();
    }
  }
  
  this.handleNewLine = function(line) {
    switch(this.state){
      case('waiting'):
        return false;
      
      default:
        if(!this.ques.hasOwnProperty('ans')){
          this.genanswer();
          if(!this.ques.hasOwnProperty('ans')){
            //throw new Error('Could not find answer: ' + line + ' '+JSON.stringify(this.ques));
            return;
          }
       }
    }
    this.state = 'waiting';
    var ret = this.ques;
    this.reset();
    return ret;
  }

  this.handle = function(line) {
    var tupmatch = this.txtregex.exec(line);
    var ansmatch = matchans(line);
    //console.log(this.state);
    switch(this.state){
      case 'waiting':
        if(tupmatch !== null){
          this.state = 'text';
          this.ques.num = tupmatch[1];
          this.ques.txt = tupmatch[2].trim();
          return true;
        }
      case 'text':
        if(ansmatch[0]) {
          /*if(this.state === 'waiting'){
            throw 'Found answer : \n'+ansmatch[1]+' \nbefore question';
          }*/
          this.state = 'answer';
          this.ques.ans = ansmatch[1];
          return true;
        }        
      case 'answer':
        if(!(line.trim() === '') && this.ques.hasOwnProperty('txt')){
          this.ques.txt += line;
        }
        if(line.trim() === ''){
	        return this.handleNewLine(line);
        }
      default:
        if(line.search(/bonus/i) !== -1){

          return 'bonus';
        }
    }
    return false;
  }
}

//Takes in file, encoding, packet name, and callback
//Acts as a state machine, passes lines to depending on state
exports.parse = function(file, enc, pname, cb){
  var state = 'tossup';
  var tup = [];
  fs.readFile(__dirname + '/' + file, enc, function(err, data){
    if (err) throw err;
    lines = data.split('\n');
    var qh = new tossupHandler(pname);
    lines.forEach(function(cur){
      switch(state){
      case 'tossup':
        var resp = qh.handle(cur);
        if (typeof resp === 'object') tup.push(resp);
        if(resp === 'bonus'){
          state = 'bonus';
          cb(null, tup);
        }
        break; 
      }      
    });
  });
}

exports.zipconv = function(fp, callback){
  var AdmZip = require('adm-zip'),
    zip = new AdmZip(fp[0]),
    zipEntries = zip.getEntries(),
    path = require('path'),
    num = zipEntries.length,
    ret = [];

  zipEntries.forEach(function(zipEntry){
    if(path.extname(zipEntry.entryName) === '.doc'){
      zip.extractEntryTo(zipEntry.entryName, __dirname + "/queue", true, true); 
      exec('abiword -t txt ' + __dirname + '/queue/"' + zipEntry.entryName+'"', function(){
        console.log(zipEntry.entryName +' converted '+fs.existsSync('queue/'+zipEntry.entryName.substring(0, zipEntry.entryName.length-3)+'txt'));
        exports.parse('queue/'+zipEntry.entryName.substring(0, zipEntry.entryName.length-3)+'txt', 'utf8', [zipEntry.name, fp[1]], function(err, ray){
          num--;
          ret.push(ray);
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
