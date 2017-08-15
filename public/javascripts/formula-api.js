//Created to manage the creation and submission of
// formulas at './formula' in app
$(document).ready(function(){
  $.getJSON('/api/formula', updateIngredient);

//this creates a post request when you hit 'Submit' on a formula page.
  $('button').on('click', function(e){
    e.preventDefault();
    $.ajax({
      url:  (this.id) ? '/formula-list/' + this.id : '/formula-list',
      type: 'POST',
      data: {
        name: $('#project').val(),
        description: $('#description').val()
        numContainer: null,
        typeContainer: null,
        price: null,
        servings: null
      }
    });
    $('.formula-body').empty();
    $('#project, #description').val("");
  });

//this is what happens when you hit 'Add Ingredient' on the formula building form
  $('.formula-form').submit(function(e){
    e.preventDefault();
    $.post('/api/formula', {
          name: $('#name').val(),
          amount: $('#amount').val(),
          notes: $('#notes').val(),
          percentCarrier: null,
          costPerKilo: null,
          source: null,
          packSize: null
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
