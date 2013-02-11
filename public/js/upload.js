// Handles the alert close
$('.close').click(function(){
  $(this).parent('.alert').hide();
});

$('#upzip').submit(function(e){
  e.preventDefault();
  var formdata = new FormData($(this).get(0));
  var thefile = $('input[type="file"]').get(0).files[0];
  formdata.append('zip', thefile);
  $.ajax({
    type: 'POST',
    url: '/upload',
    data: formdata,
    processData: false,
    contentType: false,
    dataType: 'json',
    beforeSend: function(){
      $(document).ajaxSend(function(e, jqxhr) {
        $('.alert').show();
      });
    },
    error: function(jqxhr, txtstatus, errorthrown){
      $('.alert').show().text('Upload failed! '+jqxhr.responseText).removeClass('alert-info').addClass('alert-error').delay(5000).hide(2000);
    },
    success: function(data){
      $('.alert').show().text('Upload successful!').removeClass('alert-info').addClass('alert-success').delay(5000).hide(2000);
      for(var i=data[0].length;i>1;i--){
        $('.pagination ul li.active').after('<li><a href="#">'+i+'</a></li>');
      }
      p = new Page(1, data[0].length, data[0], data[1]);
      $('.pagination li').bind('click', handleClick);
      $('#review textarea').first().val(JSON.stringify(data[0][0]));
      $('#review textarea').last().val(JSON.stringify(data[1][0]));
    }
  });
});

$('#review').submit(function(e){
  e.preventDefault();
  if(typeof p === 'undefined') { return; }
  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/database/tossup/index',
    data: {'data': JSON.stringify(p.tossup)},
  }).done(function(){
    alert('put tossups into database');
  });
  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/database/bonus/index',
    data: {'data': JSON.stringify(p.bonus)},
  }).done(function(){
    alert('put bonuses into database');
  });
});

//Pagination code
function Page(num, len, tup, bns) {
  this.num = num;
  this.len = len;
  this.tossup = tup;
  this.bonus = bns;
}

Page.prototype.handle = function() {
  $('.pagination li').removeClass('active disabled');
  $('.pagination li').eq(this.num).addClass('active');
  if(this.num==1){
    $($('.pagination li').get(0)).addClass('disabled');
  }
  if(this.num==this.len){
    $('.pagination li').eq(this.len+1).addClass('disabled');
  }
  $('#review textarea').first().val(JSON.stringify(this.tossup[this.num-1]));
  $('#review textarea').last().val(JSON.stringify(this.bonus[this.num-1]));
}

Page.prototype.back = function(){
  if(this.num > 1){
    this.num--;
    this.handle();
  }
}

Page.prototype.next = function(){
  if(this.num < this.len){
    this.num++;
    this.handle();
  }
}

Page.prototype.set = function(n){
  this.num = n;
  this.handle();
}

var handleClick = function(e){
  if(typeof p === 'undefined') return;
  var pos = $('.pagination li').index(this);
  switch(pos){
  case 0:
    p.back();
    break;
  case p.len+1:
    p.next();
    break;
  default:
    p.set(pos)
    break;
  } 
}
$('#resize textarea').val('');
