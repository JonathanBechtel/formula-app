$(document).ready(function(){
  console.log("The page has loaded.");
  $.getJSON('/api/formula', updateIngredient);

  $('button').on('click', function(e){
    e.preventDefault();
    $.post('/api/formula-list');
    $('.formula-body').empty();
  });

  $('.formula-form').submit(function(e){
    e.preventDefault(); //stops page from reloading
    $.post('/api/formula', {
        name: $('#name').val(),
        amount: $('#amount').val(),
        notes: $('#notes').val()
    }, updateIngredient);
    $(this).trigger("reset");
  });

  $('.formula-body').on('click', function(e){
    if (e.target.className == 'fa fa-trash-o') {
      $.ajax({
        url: 'api/formula/' + e.target.id,
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
