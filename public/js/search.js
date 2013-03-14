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
        from: f || 0,
        size: 10,
        type: $('#typesel').prop('selectedIndex'),
        loc: $('#locsel').prop('selectedIndex')
      },
      datatype: 'json', 
    })
      .done(function( data ){
        ray = (typeof(data) === 'string') ? JSON.parse(data).hits.hits : data.hits.hits;
        if(ray.length === 0) { $("#output").text('nothing found'); return; }
        $('#output').text('');
        ray.forEach(dispQ);
        changeSubj();
        if(window.location.pathname != '/search/'+$('#searchbar').val()){
          history.pushState(null, null, '/search/'+$('#searchbar').val()); 
        } 
    });
  });
};

$('#searchbar').bind('keyup', search);

$('.form-search button').click(function(e){
  e.preventDefault();
  search(e);
});

$('select').change(function(e){
  search(e);
});

var regex = /\/search\/(\w+)?/;

if(regex.test(window.location.href)){
  var queso = regex.exec(window.location.href);
  $('#searchbar').val(queso[1]);
  $('.form-search button').click();
}
