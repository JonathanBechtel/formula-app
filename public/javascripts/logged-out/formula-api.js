//Created to manage the creation and submission of
// formulas at './formula' in app
$(document).ready(function(){
  $.getJSON('/api/formula', updateIngredient);

//Gets called when you hit 'Submit', checks to make sure everything is filled out, then submits AJAX POST request
  $('.formula-submit').on('click', function(e){
    e.preventDefault();

    //Checks to see if fields in 'Project Info' column are filled out;
    function fieldsNeedFilledOut(){
      var counter = 0;
      $('#formula-info-form input').each(function(item){
          if(!$(this).val()){
            counter += 1;
          }
        });
        if (counter > 0) {
          return true;
        }
        return false;
      }

    //Checks to see if user has entered formula by seeing if rows have been added to table
    function formulaNotEntered() {
      if($('.formula-table tr').length ===1) {
        return true;
      }
      return false;
    }

    if (fieldsNeedFilledOut()) {
        $('#modal2').modal();
    } else if (formulaNotEntered()) {
        $('#modal3').modal();
    } else {
        $.ajax({
          url:  (this.id) ? '/formula-list/' + this.id : '/formula-list',
          type: 'POST',
          data: {
            name:         $('#project').val(),
            description:  $('#description').val(),
            numContainer: $('#numContainer').val(),
            form:         $('#form').val(),
            price:        $('#price').val(),
            servings:     $('#servings').val(),
            timeframe:    $('#timeframe').val()
          }
      });
      $('.formula-body').empty();
      $('#project, #description').val("");
      $('#modal1').modal();
    }
  });

//this is what happens when you hit 'Add Ingredient' on the formula building form
  $('.formula-form').submit(function(e){
    e.preventDefault();
    $.post('/api/formula', {
          name:            $('#name').val(),
          amount:          $('#amount').val(),
          notes:           $('#notes').val(),
          percentCarrier:  null,
          costPerKilo:     null,
          source:          null,
          packSize:        null
    }, updateIngredient);
    $('#name, #amount, #notes').val("");
  });

//this is what happens when you hit the trash icon next to an ingredient in the table
  $('.formula-body').on('click', function(e){
    if (e.target.className == 'fa fa-trash-o') {
      $.ajax({
        url: '/api/formula/' + e.target.id,
        type: 'DELETE',
        success:  updateIngredient
      });
    }
  });

//this function rebuilds the table everytime a row is added or deleted from it
  function updateIngredient(data) {
    $('.formula-body').empty();
    var output = '';
    $.each(data, function(key, item){
      output = `
        <tr>
          <td class="name">${item.name}</td>
          <td class="amount">${item.amount}</td>
          <td class="notes">${item.notes}</td>
          <td><a><span id ="${key}" class="fa fa-trash-o">  </span></a></td>
        </tr>
        `;
      $('tbody').append(output);
    });
  };
});
