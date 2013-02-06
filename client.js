var search = document.getElementById('searchbar');
var code = document.getElementById('output');

search.addEventListener('keyup', function(){
  var xhr = new XMLHttpRequest;
  xhr.open('GET', 'http://173.172.90.120:9200/questions/_search?q=' + search.value, true);
  xhr.onreadystatechange = function(){
    if (4 == xhr.readyState) {
      var tup = JSON.parse(xhr.responseText).hits.hits[0]._source;
      code.textContent = tup.txt+'ANSWER: '+tup.ans
    }
  };
  xhr.send();
}, false);
