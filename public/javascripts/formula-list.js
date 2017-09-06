$(document).ready(function(){
  $('.formula-block').on('click', function(e){
    if (e.target.className == 'button-warning pure-button') {
      $.ajax({
        url: '/formula-list/' + this.id,
        type: 'DELETE',
        success: reload
    });
  }
  });

  function reload () {
    window.location.reload(true);
      }
  });
