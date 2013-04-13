$(document).ajaxSend(function(e, jqXHR){
  $("#load").text('loading');
});

$(document).ajaxComplete(function(e, jqXHR){
  //remove the div here
  $("#load").text('done loading');
});

//Object that handles page navigation
function searchman(start, total){
  this.pos = start;
  this.total = total;
  var disp = function(p, t){
    $('#pos').text(''+(p+1)+'-'+Math.min(p+11, t));
    $('#tot').text(t);
  }
  disp(this.pos, this.total);
  this.prev = function(){
    if(this.pos - 10 >= 0){
      this.pos -= 10;
      //disp(this.pos, this.total);
      search(null, this.pos);
    }
  }
  this.next = function(){
    if(this.pos + 10 < total){
      this.pos += 10;
      //disp(this.pos, this.total);
      search(null, this.pos);
    }
  }
};

window.searchbot = new searchman(0, 0);

$('.leftarrow').click(function(){
  searchbot.prev();
});

$('.rightarrow').click(function(){
  searchbot.next();
});

//Generates the subject matrix
var ROW = 9;
var COL = 6;
var row = '<thead><tr>'
for(var i=1; i <= COL; i++){
  row += '<th>' + subjects[i][0] + '</th>';
}
row += '</tr></thead>';
$('table').append(row);
$('table').append('<tbody>');
row = '';

for(var r=1;r<ROW;r++){
  var row = '<tr>'
  for(var c=1;c<=COL;c++){
    row += '<td>' + (subjects[c][r] || '') + '</td>';
  }
  row += '</tr>';
  $('table').append(row);
}

$('table').append('</tbody>')

$('table').find('td').each(function(i, e){
  if($(e).text() === ''){
    $(e).addClass('disabled');
  }
});

var search = function(e, f){
  $.doTimeout('search', 500, function(){
    if(e && (e.type === "keyup" && ((e.which !== 8 && e.which < 48) || e.which > 91 ))){
      console.log('no');
      return; 
    }
    if(!$('#searchbar').val()){
      $('#searchbar').val('*');
    }
    var ray = [0];
    for(var r=1;r<ROW;r++){
      for(var c=1;c<=COL;c++){
        if($('tbody').children().eq(r-1).children().eq(c-1).hasClass('highlight')){
          ray.push(c*10 + r);
        }
      }
    };
    $.ajax({
      url: '/database/search',
      data: {
        query: $("#searchbar").val(),
        from: f || 0,
        size: 10,
        type: $('select[name="typesel"]').prop('selectedIndex'),
        loc: $('select[name="locsel"]').prop('selectedIndex'),
        diff: $('input[name="slider"]').data().slider.value,
        subj: ray,
      },
      datatype: 'json', 
    })
      .done(function( data ){
        $('#output').text('');
        data = (typeof(data) === 'string') ? JSON.parse(data).hits : data.hits;
        var ray = data.hits;
        if(ray.length === 0) { $("#output").text('nothing found'); return; }
        searchbot= new searchman(f, data.total);
        ray.forEach(dispQ);
        renderSubj();
        updatemenu();
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


$('input[name="slider"]').slider({value: [4, 7]})
  .on('slideStop', function(e){
    search(e, 0);
  });


var regex = /\/search\/(.*)$/;
if(regex.test(window.location.href)){
  var thing = regex.exec(window.location.href)[1];
  $('#searchbar').val(thing.split('%20').join(' ').replace(/[^a-zA-Z0-9]/g, ''));
  $('.form-search button').click(); 
}

$('#subjbutton').on('click', function(e){
  e.preventDefault();
  if($(this).text() === 'Show Subjects'){
    $(this).text('Hide Subjects');
  }
  else {
    $(this).text('Show Subjects');
  }
  $('table').fadeToggle(400);
});

$('td').on('click', function(){
  if($(this).hasClass('disabled')){
    return;
  }
  //check if dude thing face
  var index = $(this)
  $(this).toggleClass('highlight');
});

$('th').on('click', function(){
  var index = $('tr').first().children().index(this);
  var on = $(this).hasClass('highlight')
  $('tbody').children().each(function(i, e){
    $(e).children().each(function(ind, ele){
      if(ind === index && !$(ele).hasClass('disabled')){
        if(!on){ 
          $(ele).addClass('highlight');
        }
        else {
          $(ele).removeClass('highlight');
        }
      }
    });
  });
  $(this).toggleClass('highlight');
});
