$(document).ajaxSend(function(e, jqXHR){
  $("#load").text('loading');
});
$(document).ajaxComplete(function(e, jqXHR){
  //remove the div here
  $("#load").text('done loading');
});

$("#searchbar").keyup(function(){
  if(!$("#searchbar").val()) { return; }
  $.ajax({
    url: 'http://173.172.90.120:9200/questions/_search',
    data: {q: $("#searchbar").val()},
    datatype: 'json', 
  }).done(function( data ){
      var a = '',
        ray = (typeof(data) === 'string') ? JSON.parse(data).hits.hits : data.hits.hits;
      if(ray.length === 0) { $("#output").text('nothing found'); return; }
      ray.forEach(function(q){
        ques = q._source;
        a += '<div class="question"><div class="title">'+ques.tmt.name+' '+ques.tmt.year+' - '+ques.pack+'</div>';
        a += '<div class="text">'+ques.num+'. '+ques.txt+'</div>';
        switch(q._type){
          case "tossup":
            a += '<div class="ans">ANSWER: '+ques.ans+'</div>';
            break;
          case "bonus":
            a += '<div class="bonuspart">[10] '+ques.part1+'</div>';
            a += '<div class="ans">ANSWER: '+ques.ans1+'</div>';
            a += '<div class="bonuspart">[10] '+ques.part2+'</div>';
            a += '<div class="ans">ANSWER: '+ques.ans2+'</div>';
            a += '<div class="bonuspart">[10] '+ques.part3+'</div>';
            a += '<div class="ans">ANSWER: '+ques.ans3+'</div>';
            break;
        }
        a += '</div><br />';
      });
      $("#output").html(a);
  });
});
