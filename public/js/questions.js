var dropDownMenu = '<div class="btn-group dropup">    <a class="btn btn-mini btn-info dropdown-toggle" data-toggle="dropdown" href="#"><i class="icon-tags icon-white"></i><span class="caret"></span></a>    <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">      <li><a tabindex = "-1" href ="#">0</a></li>        <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">10</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">11</a></li>            <li><a tabindex = "-1" href ="#">12</a></li>            <li><a tabindex = "-1" href ="#">13</a></li>    <li><a tabindex = "-1" href ="#">14</a></li>    </ul>      </li>      <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">20</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">21</a></li>            <li><a tabindex = "-1" href ="#">22</a></li>            <li><a tabindex = "-1" href ="#">23</a></li>          <li><a tabindex = "-1" href ="#">24</a></li>  <li><a tabindex = "-1" href ="#">25</a></li>        </ul>      </li>      <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">30</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">31</a></li>            <li><a tabindex = "-1" href ="#">32</a></li>            <li><a tabindex = "-1" href ="#">33</a></li>          <li><a tabindex = "-1" href ="#">34</a></li>            <li><a tabindex = "-1" href ="#">35</a></li>            <li><a tabindex = "-1" href ="#">36</a></li>          <li><a tabindex = "-1" href ="#">37</a></li>          </ul>      </li>      <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">40</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">41</a></li>            <li><a tabindex = "-1" href ="#">42</a></li>            <li><a tabindex = "-1" href ="#">43</a></li>        </ul>      </li>      <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">50</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">51</a></li>            <li><a tabindex = "-1" href ="#">52</a></li>            <li><a tabindex = "-1" href ="#">53</a></li>          <li><a tabindex = "-1" href ="#">54</a></li>            <li><a tabindex = "-1" href ="#">55</a></li>            <li><a tabindex = "-1" href ="#">56</a></li>        </ul>      </li>      <li class = "dropdown-submenu">        <a tabindex = "-1" href = "#">60</a>        <ul class = "dropdown-menu">          <li><a tabindex = "-1" href ="#">61</a></li>            <li><a tabindex = "-1" href ="#">62</a></li>            <li><a tabindex = "-1" href ="#">63</a></li>          <li><a tabindex = "-1" href ="#">64</a></li>            <li><a tabindex = "-1" href ="#">65</a></li>            <li><a tabindex = "-1" href ="#">66</a></li>          <li><a tabindex = "-1" href ="#">67</a></li>    <li><a tabindex = "-1" href ="#">68</a></li>    </ul>      </li>    </ul>  </div>';

var subjects = [
  [
    'Uncategorized'
  ],
  [
    'History',
    'American History',
    'European History',
    'World History',
    'Ancient History'
  ],
  [
    'Literature',
    'American Literature',
    'British Literature',
    'European Literature',
    'World Literature',
    'Ancient Literature',
  ],
  [
    'Science',
    'Biology',
    'Chemistry',
    'Physics',
    'Mathematics',
    'Astronomy',
    'Earth Science',
    'Computer Science',
  ],
  [
    'RMP',
    'Religion',
    'Mythology',
    'Philosophy'
  ],
  [
    'Fine Arts',
    'Classical Music',
    'Opera',
    'Other Music',
    'Paintings',
    'Sculpture',
    'Other Art',
  ],
  [
    'Other',
    'Anthropology',
    'Economics',
    'Psychology',
    'Other Social Science',
    'Geography',
    'Miscellaneous',
    'Current Events',
    'TRASH'
  ]
];

//Converts number to subject
var numToSubj = function(num) {
   return subjects[Math.floor(num/10)][Math.floor(num%10)];
};

//For each menu, highlights the selected subject
var updatemenu = function(){
  $('.question').each(function(i,e){
    var subj = $(e).data('q')._source.subj;
    var menu = $(e).find('ul.dropdown-menu').eq(0);
    if(subj === 0){
      $(e).find('li').first().addClass('selector');
    }
    else {
      var bnum = Math.floor(subj / 10),
        snum = subj % 10;
      menu.children('li').eq(bnum).addClass('selector');
      menu.children('li').eq(bnum).find('li').eq(snum - 1).addClass('selector');
    }
  });
};

//Replaces the numbers in the dropdown menu with elements in the subjects array
var renderSubj = function(){
  $('a[tabindex="-1"]').each(function(i, e){
    var txt = $(e).text();
    if($.isNumeric(txt)){
      var subj = numToSubj(parseInt(txt));
      $(e).text(subj);
    }
  });
};

//Ajax event fired which updates the database each time a subject is changed
var changeSubj = function(e){
  var listelem = $(e.target).parent();
  var list = listelem.parents('li.dropdown-submenu');
  var snum = list.children('ul').children().index(listelem) + 1;
  var bnum = list.parent().children().index(list);
  var nsubj = 10*bnum + snum;
  
  $.ajax({
    url: '/database/update',
    type: 'POST',
    data: {
      q: list.parents('.question').data('q'),
      newsubj: nsubj,
    },
    datatype: 'json', 
  }).done(function( data ){
    $('li').removeClass('selector');
    list.parents('.question').data('q')._source.subj = nsubj;
    updatemenu();
  });
}

var dispQ = function(q){
  var a = '',
    ques = q._source;
  a += '<div class="question"><div class="title">'+ques.tmt.name+' '+ques.tmt.year+' - '+ques.pack+' - '+numToSubj(ques.subj)+' - '+dropDownMenu+'</div>';
  a += '<div class="text">'+ques.num+'. '+ques.txt+'</div>';
  switch(q._type){
    case "tossup":
      a += '<div class="ans">ANSWER: '+ques.ans+'</div>';
      break;
    case "bonus":
      a += '<div class="bonuspart">[10] '+ques.part1+'</div>';
      a += '<div class="ans">'+ques.ans1+'</div>';
      a += '<div class="bonuspart">[10] '+ques.part2+'</div>';
      a += '<div class="ans">'+ques.ans2+'</div>';
      a += '<div class="bonuspart">[10] '+ques.part3+'</div>';
      a += '<div class="ans">'+ques.ans3+'</div>';
      break;
  }
  a += '</div><hr />';
  $("#output").append(a);
  $('#output > div').last().data('q', q);
  $('a[tabindex="-1"]').on('click', function(e){
    e.preventDefault();
    if($(e.target).parent().hasClass('dropdown-submenu')){
      return;
    }
    $.doTimeout('categorize', 500, function(){
      changeSubj(e);
    });
  });
}


