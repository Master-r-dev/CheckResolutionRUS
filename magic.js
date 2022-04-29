var start_url = 'https://have-a-rest.net/ru/'; //сайт который проверяется по умолчанию с запуском страницы(выбрал красивый )
// http://mospolytech.ru/  можно тоже для проверки

//функция которая проверяет: прогрузились ли все окна
function AllFramesLoaded(){
  var r = [];
  $('iframe').each(function(){
    if(!$(this).data('loaded')){r.push(false)}
  });
  var all_is_okay = (r.length > 0) ? false : true;
  return all_is_okay;
};
function showLoader(id) {
  $('#' + id + ' img').fadeIn('slow');
}
function hideLoader(id) {
  $('#' + id + ' img').fadeOut('slow');
}
//загружение страниц
function loadPage($frame, url) {
  if ( url.substr(0, 7) !== 'file://'  && url.substr(0,7) !== 'http://' && url.substr(0,8) !== 'https://'  ) {
    url = 'http://'+url;
  }
  $('iframe').not($frame).each(function(){showLoader($(this).parent().attr('id'));})
  $('iframe').not($frame).data('loaded', false);
  $('iframe').not($frame).attr('src', url);
}
$('.frame').each(function(){showLoader($(this).attr('id'))});
//при запуске
$(document).ready(function(){
  loadPage('', start_url);
  //строка запроса 
  var string_query = window.location.href.split('?');
  var query_string = string_query[string_query.length-1];
  if(query_string != '' && string_query.length > 1){
    $('#url input[type=text]').val(query_string);
    loadPage('', query_string);
  }
  $('#frames #inner').css('width', function(){
    var width = 0;
    $('.frame').each(function(){width += $(this).outerWidth() + 20});
    return width;
  });
  // для опций справа(radio кнопки)
  $('input[type=radio]').change(function(){
    $frames = $('#frames');
    $inputs = $('input[type=radio]:checked').val();
    if($inputs == '1'){
      $frames.addClass('widthOnly');
    } else {
      $frames.removeClass('widthOnly');
    }
  });
  //для ползунков
  $('input[type=checkbox]').change(function(){
    var scrolling_width = 15;
    $frames = $('#frames');
    $inputs = $('#scrollbar:checked');
    if( $inputs.length == 0 ){  scrolling_width = -15;}
    $frames.find('iframe').each(function(i,el) {
      $(el).attr('width', parseInt($(el).attr('width')) + scrolling_width);
    });
  });

  //когда  используете рамку(поле) для url ссылкок 
  $('form').submit(function(){
    loadPage('' , $('#url input[type=text]').val());
    return false;
  });

  //когда окно(где сайт от url появляется) грузится
  $('iframe').load(function(){
    var error = false;
	var $this = $(this);
    var url = '';
    try{
      url = $this.contents().get(0).location.href;
    } catch(e) {
      error = true;
      if($('#url input[type=text]').val() != ''){
        url = $('#url input[type=text]').val();
      } else {
        url = start_url;
      }
    }
    //заполнить все окна  тем же url 
    if(AllFramesLoaded()){
      if(error){
        alert('Ой, 418 I am a teapot.\nБраузер запрещает навигацию внутри окон между доменами.\nИспользуйте поле ввода текста (которое сверху) для внешних ссылок');
        loadPage('', start_url);
      }else{
        loadPage($this, url);
      }
    }
    else{
      error = false;
      hideLoader($(this).parent().attr('id'));
      $(this).data('loaded',true);
    }
  });

});
