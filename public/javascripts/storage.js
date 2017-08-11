//this file stores the data from a users formula @ /formula and saves it to localStorage
// so it can be reused later after logging in.
$(document).ready(function(){
  //tests to see if browser has localStorage installed
  var storagePresent = function() {
    var test = "test";
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  }

  //next two functions allow you to show the modal on page load w/ slight delay.
  function showModalWithDelay (){
    timeoutID = window.setTimeout(showModal, 3000);
  }

  function showModal(){
    $('#modal').modal();
  }

  //apply storagePresent(), proceed if true, flash modal if not.
  if (storagePresent()) {
    $('.formula-submit').click(function(){

      //clear any presets from the browser
      localStorage.clear();

      //declare variables
      var projectName = $('#project').val();
      var description = $('#description').val();

      //load json, use it to load localStorage object
      var data = "../../api/formula"
      $.getJSON(data, function(json){
        localStorage.setItem("name", projectName);
        localStorage.setItem("description", description);
        localStorage.setItem("ingredients", JSON.stringify(json));
      });
    });
    //if localStorage not present, prompt warning message with links to login or register
  } else {
    showModalWithDelay();
  }
});
