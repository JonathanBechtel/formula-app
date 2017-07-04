//Created to manage the creation and submission of
// formulas at './formula' in app
$(document).ready(function(){
  $.getJSON('/api/formula', updateIngredient);

  $('button').on('click', function(e){
    e.preventDefault();
    $.ajax({
      url:  (this.id) ? '/formula-list/' + this.id : '/formula-list',
      type: 'POST',
      data: {
        name: $('#project').val(),
        description: $('#description').val()
      }
    });
    $('.formula-body').empty();
    $('#project, #description').val("");
  });

  $('.formula-form').submit(function(e){
    e.preventDefault();
    $.post('/api/formula', {
          name: $('#name').val(),
          amount: $('#amount').val(),
          notes: $('#notes').val()
    }, updateIngredient);
    $('#name, #amount, #notes').val("");
  });

  $('.formula-body').on('click', function(e){
    if (e.target.className == 'fa fa-trash-o') {
      $.ajax({
        url: '/api/formula/' + e.target.id,
        type: 'DELETE',
        success:  updateIngredient
      });
    }
  });

  function updateIngredient(data) {
    $('.formula-body').empty();
    var output = '';
    $.each(data, function(key, item){
      output = `
        <tr>
          <td>${item.name}</td>
          <td>${item.amount}</td>
          <td>${item.notes}</td>
          <td><a><span id ="${key}" class="fa fa-trash-o">  </span></a></td>
        </tr>
        `;
      $('tbody').append(output);
    });
  };
});
