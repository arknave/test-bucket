var search = $("#searchbar");
var code = $("#output");

var db = {'ying': 'liu', 'arnav': 'sastry', 'freed': 'alex', 'greg': 'the lyon is more threatening than the cougar', 'alex':'"#SWAG #YOLO" denko', 'mikey':'zhou', 'stephen':'ngo','brian':'cui','trey':'gonsulin','evan':'tey','elliot':'gordon','jorge':'martinez','jesse':'patterson','mr':'stephens','imran':'kahloro'};
search.keyup(function() {
  if(db[search.val()]!==undefined){
    code.text(search.val()+" "+db[search.val()]);
  }
});
