//used to build the chart on left side of page after 'formula info' is selecte
  google.charts.load('current', {
    'callback': loadIngredients,
    'packages': ['corechart']
  });

  function loadIngredients() {
    var jsonData = {
     "cols": [
     {"id":"","label":"Ingredient","pattern":"","type":"string"},
     {"id":"","label":"Amount","pattern":"","type":"number"}
     ],
     "rows": []
    };

    $.getJSON('/api/formula', function(data){
      $.each(data, function(key, item){
        jsonData.rows.push({"c":[{"v":item.name,"f":null},{"v":parseInt(item.amount),"f":null}]});
      });
      drawChart(jsonData);
    });

  }

    function drawChart(jsonData) {
      var options = {
        'pieHole': 0.4,
        'chartArea': {
          top: 0,
          width: '100%',
          height: 600
        }
      };

      var data = new google.visualization.DataTable(jsonData);
      var chart = new google.visualization.PieChart(document.getElementById('formula-chart-div'));
      chart.draw(data, options);
    }
