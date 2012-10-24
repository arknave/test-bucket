var fs = require('fs');

fs.readFile('acfdb.txt', function(err, data) {
  if(err){
    throw err;
  }
  for(var i in data){
    if(i !== undefined && typeof i !== 'function')
      console.log(i+" "+String.fromCharCode(data[i]));
  }
});
