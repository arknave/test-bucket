$(document).ajaxSend(function(e, jqXHR){
  $("#load").text('loading');
});

$(document).ajaxComplete(function(e, jqXHR){
  //remove the div here
  $("#load").text('done loading');
});

var search = function(e, f){
  $.doTimeout('search', 500, function(){
    if(!($("#searchbar").val()) || (e.type === "keyup" && (e.which < 48 || e.which > 91 ))){
      return; 
    }
    $.ajax({
      url: '/database/search',
      data: {
        query: $("#searchbar").val(),
        from: f,
        size: 10,
      },
      datatype: 'json', 
    }).done(function( data ){
        ray = (typeof(data) === 'string') ? JSON.parse(data).hits.hits : data.hits.hits;
        if(ray.length === 0) { $("#output").text('nothing found'); return; }
        $('#output').text('');
        ray.forEach(dispQ);
        changeSubj();
    });
  });
};

$('#searchbar').bind('keyup', function(e){
  search(e, 0);
});

$('.form-search button').click(function(e){
  e.preventDefault();
  search(e, 0);
});

