domain_map = {'rank' : [100,0],'totoal_score':[0,100], 'teaching' :[0,100], 'research': [0,100], 'citations': [0,100], 
                        'international_students':[0,100]}
svg_map = {'rank' : '#s1','totoal_score':'#s2', 'teaching' :'#s3', 'research': '#s4', 'citations': '#s5', 
                        'international_students':'#s6'}
d3.csv("metadata/timesData.csv", function(err, data) {

  var universities = {}
  var international_student_min = 100
  var international_student_max = -1
  data.forEach(function(d){
    // d.year = parseDate(d.year);
    if (!(d.university_name in universities)) {
      universities[d.university_name] = {'rank' : [],'totoal_score':[], 'teaching' :[], 'research': [], 'citations': [], 
                        'international_students':[]}
    }
    universities[d.university_name]['rank'].push({year:d.year,val: d.world_rank})
    universities[d.university_name]['totoal_score'].push({year:d.year, val: d.total_score})
    universities[d.university_name]['teaching'].push({year: d.year, val: d.teaching})
    universities[d.university_name]['international_students'].push({year: d.year, val : d.international_students})
    universities[d.university_name]['research'].push({year: d.year, val: d.research})
    universities[d.university_name]['citations'].push({year: d.year, val: d.citations})
    international_student_min = Math.min(international_student_min, d.international_students)
    international_student_max = Math.max(international_student_max, d.international_students)
  });
  // {a:{'rank':[{"year:2016,val = 1"}]}}

  function drawlinegraph (u1,u2,aspect) {
      
var margin = {top: 20, right: 150, bottom: 20, left: 50},
    width = 400 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;


var xScale = d3.scale.linear()
    .range([0, width]);
    

var yScale = d3.scale.linear()
    .range([height, 0]);  

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);

var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return xScale(+d.year); })
      .y(function(d) { return yScale(+d.val); });

var svg = d3.select(svg_map[aspect]).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // u = [u1,u2]
      color.domain([u1,u2]);
      var univers = [{name : u1, values : universities[u1][aspect]},
              {name : u2, values : universities[u2][aspect]}]
      // console.log(univers);
      // x.domain([2011,2016]);
      xScale.domain(d3.extent(data, function(d) { return d.year; }));
      yScale.domain(domain_map[aspect])
      
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width/2)
          .attr("y", 30)
          .style("text-anchor", "end")
          .text("Year");

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "translate(-" + 30 + "," + (height / 2) + ") rotate(-90)")
        .attr("class","label")
        .style("text-anchor", "middle")
        .text(aspect);

      
      var univer = svg.selectAll(".univer")
        .data(univers)
        .enter().append("g")
        .attr("class", "univer");

      univer.append("path")
        .attr("class", "line")
        .attr("d", function(d) {return line(d.values); })
        .style("stroke", function(d) { return color(d.name);} );

      univer.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + xScale(d.value.year) + "," + yScale(d.value.val) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

   }
  aspects = ['rank','totoal_score', 'teaching', 'research', 'citations','international_students']
  for (var i = 0; i < aspects.length; i++) {
    drawlinegraph("Harvard University","Peking University",aspects[i])  
  }
  
});