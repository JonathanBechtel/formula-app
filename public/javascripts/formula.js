//This file determines UI interactions when you hit the "formula info" button @ /formula
$(document).ready(function(){
  $('.formula-info').click(function(){

    //Next two functions are for verifying forms are properly filled out

    //Checks to see if required fields in 'Project Info' column are filled out;
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

    //verify everything's filled out corretly - if no, flash a modal --if yes, then carry on with the show
    if (fieldsNeedFilledOut()) {
        $('#modal2').modal();
    } else if(formulaNotEntered()) {
        $('#modal3').modal();
    } else {
      //fade in new div
      $('#formula-info-div').fadeIn(750);
      $('#formula-build-div').hide();

      //draw chart from formula-chart.js
      loadIngredients();

      //these are used to populate values in formula-info-table
      function amtPerBottle(amtServing, numServings) {
        return (amtServing * numServings);
      }

      function amtPerRun(stuffPerBottle, runSize) {
        return (stuffPerBottle * runSize)/(1000000);
      }

      var totalPerServing = null;
      var totalPerBottle  = null;
      var totalPerRun     = null;

      //grab json data for formula ingredients
      $.getJSON('/api/formula', function(data){
        $('.formula-breakdown-table > tbody').empty();
        //fill in table with info provided in form at top of page
        $.each(data, function(key, item){

          var amtServing  = parseFloat(item.amount);
          var numServings = parseInt($('#servings').val());
          var runSize     = parseInt($('#numContainer').val());
          var perBottle   = amtPerBottle(amtServing, numServings);
          var perRun      = amtPerRun(perBottle, runSize);

          totalPerServing += amtServing;
          totalPerBottle  += perBottle;
          totalPerRun     += perRun;

          output = `
          <tr>
            <td class="name">${item.name}</td>
            <td class="amount">${item.amount}</td>
            <td class="amtBottle">${perBottle}</td>
            <td class="amtRun">${perRun}</td>
          </tr>
          `;
          $('.formula-breakdown-table > tbody').append(output);
        });
        $('.formula-breakdown-table > tbody').append(
          `        <tr>
                    <td class="name"><strong>Totals:</strong></td>
                    <td class="amount">${totalPerServing}</td>
                    <td class="amtBottle">${totalPerBottle}</td>
                    <td class="amtRun">${totalPerRun}</td>
                  </tr>
          `
        );
      });
    }
  });

//fade in top of page
  $('.back-to-main-page').click(function(){
    $('#formula-build-div').fadeIn(750);
    $('#formula-info-div').hide();
  });

 //sends post request when user hits the 'Generate PDF' button
 $('.getPDF').click(function(){
   var filepath = 'http://nutraceutical-pro.herokuapp.com/pdf/formula-' + this.id + '.pdf';
   $.ajax({
     url: '/formulas/'+ this.id +'/pdf',
     type: 'POST',
     success: function () {window.open(filepath);}
   });

   function downloadFile (path) {
     var link = document.createElement('a');
     link.href = path;
     $(link).attr("download", true);
     link.click();
   }
 });
});
