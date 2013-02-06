var search = document.getElementById('searchbar');
var code = document.getElementById('output');

$(document).ajaxSend(function(e, jqXHR){
  $("#load").text('loading');
});
$(document).ajaxComplete(function(e, jqXHR){
  //remove the div here
  $("#load").text('done loading');
});


search.addEventListener('keyup', function(){
  if(!search.value) { return; }
  $.ajax({
    url: 'http://173.172.90.120:9200/questions/_search',
    data: {q: search.value}
  }).done(function( data ){
      var a = '',
        ray = JSON.parse(data).hits.hits;
      ray.forEach(function(q){
        ques = q._source;
        a += ''+ques.tmt.name+' '+ques.tmt.year+' - '+ques.pack+'\n';
        a += ''+ques.num+'. '+ques.txt+'\n';
        switch(q._type){
          case "tossup":
            a += 'ANSWER: '+ques.ans;
          case "bonus":
            a += '[10] '+ques.part1+'\n';
            a += 'ANSWER: '+ques.ans1+'\n';
            a += '[10] '+ques.part2+'\n';
            a += 'ANSWER: '+ques.ans2+'\n';
            a += '[10] '+ques.part3+'\n';
            a += 'ANSWER: '+ques.ans3+'\n';
            break;
        }
        a += '\n';
      }); 
      code.textContent = a;
  });
/*  var xhr = new XMLHttpRequest;
  xhr.open('GET', 'http://173.172.90.120:9200/questions/_search?q=' + search.value, true);
  xhr.onreadystatechange = function(){
    if (4 == xhr.readyState) {
    }
  };
  xhr.send();
}, false);*/
});
