$(document).ready(function(){
  $( "input:checkbox" ).change(function(){
    if(this.checked) {
      $('#oldPassword, #newPassword, #newPassword2').prop('disabled', false);
    } else {
      $('#oldPassword, #newPassword, #newPassword2').prop('disabled', true);
    }
  });
});
