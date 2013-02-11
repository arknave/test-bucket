$(document).ajaxSend(function(e, jqXHR){
  $("#load").text('loading');
});

$(document).ajaxComplete(function(e, jqXHR){
  //remove the div here
  $("#load").text('done loading');
});

var subjects = [
'Undefined',
[
'American History',
'European History',
'World History'
],
[
'American Literature',
'British Literature',
'European Literature',
'World Literature'
],
[
'Biology',
'Chemistry',
'Physics',
'Mathematics',
'Astronomy',
'Earth Science',
'Computer Science',
],
[
'Religion',
'Mythology',
'Philosophy'
],
[
'Classical Mustic',
'Opera',
'Other Music',
'Paintings',
'Sculpture',
'Other Art',
],
[
'Anthropology',
'Economics',
'Psychology',
'Other Social Science',
'Geography',
'Miscellaneous',
'TRASH'
]
];
var search = function(e){
  if(!$("#searchbar").val()|| !(e.which==8) && (e.which < 48 || e.which > 91)) { return; }
  $.ajax({
    url: '/database/search',
    data: {query: $("#searchbar").val()},
    datatype: 'json', 
  }).done(function( data ){
      console.log(data);
      ray = (typeof(data) === 'string') ? JSON.parse(data).hits : data.hits;
      if(ray.length === 0) { $("#output").text('nothing found'); return; }
      $('#output').text('');
      ray.forEach(dispQ);
  });
};

$('#searchbar').bind('keyup', search);
$('.form-search button').bind('click', function(e) {e.stopPropagation(); search(e)});

var dispQ = function(q){
  var a = '',
  ques = q._source;
  a += '<div class="question"><div class="title">'+ques.tmt.name+' '+ques.tmt.year+' - '+ques.pack+' - '+JSON.stringify(ques.subj)+'</div>';
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
  a += '</div><hr />';
  $("#output").append(a);
}

var dropDownMenu = '  <div class="dropdown">    <a class="dropdown-toggle" data-toggle="dropdown" href="#">Dropdown trigger</a>    <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">      <li><a tabindex = "-1" href ="#">0</a></li>        <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">1</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">11</a></li>            <li><a tabindex = "-1" href ="#">12</a></li>            <li><a tabindex = "-1" href ="#">13</a></li>        </ul>      </li>      <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">2</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">21</a></li>            <li><a tabindex = "-1" href ="#">22</a></li>            <li><a tabindex = "-1" href ="#">23</a></li>          <li><a tabindex = "-1" href ="#">24</a></li>          </ul>      </li>      <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">3</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">31</a></li>            <li><a tabindex = "-1" href ="#">32</a></li>            <li><a tabindex = "-1" href ="#">33</a></li>          <li><a tabindex = "-1" href ="#">34</a></li>            <li><a tabindex = "-1" href ="#">35</a></li>            <li><a tabindex = "-1" href ="#">36</a></li>          <li><a tabindex = "-1" href ="#">37</a></li>          </ul>      </li>      <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">4</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">41</a></li>            <li><a tabindex = "-1" href ="#">42</a></li>            <li><a tabindex = "-1" href ="#">43</a></li>        </ul>      </li>      <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">5</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">51</a></li>            <li><a tabindex = "-1" href ="#">52</a></li>            <li><a tabindex = "-1" href ="#">53</a></li>          <li><a tabindex = "-1" href ="#">54</a></li>            <li><a tabindex = "-1" href ="#">55</a></li>            <li><a tabindex = "-1" href ="#">56</a></li>        </ul>      </li>      <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">5</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">61</a></li>            <li><a tabindex = "-1" href ="#">62</a></li>            <li><a tabindex = "-1" href ="#">63</a></li>          <li><a tabindex = "-1" href ="#">64</a></li>            <li><a tabindex = "-1" href ="#">65</a></li>            <li><a tabindex = "-1" href ="#">66</a></li>          <li><a tabindex = "-1" href ="#">69</a></li>        </ul>      </li>    </ul>  </div>';
