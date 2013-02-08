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
    success: function(data){
      $('#review').html('<textarea></textarea><textarea></textarea>');
      $('#review textarea').first().text(JSON.stringify(data[0]).substring(0, 1000));
      $('#review textarea').last().text(JSON.stringify(data[1]).substring(0,1000));
    }
  });
});
