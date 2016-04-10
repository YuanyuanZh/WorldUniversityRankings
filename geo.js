
d3.csv("timesData.csv", function(err, data) {

  var valueHash = {}
  var max = 0
  var min = 1000000
  data.forEach(function(d){
    if (d.year === "2016") {
      var name = d.country   
      if (!(name in valueHash)) {
        valueHash[name] = 1
      }
      else {
        valueHash[name] = +valueHash[name] +1
      }
      max = Math.max (max, valueHash[name])
      min = Math.min (min, valueHash[name])
    }
  });
  console.log(valueHash.China);
  console.log(max)
  
  var width = 960,
      height = 960;
  
  var color = d3.scale.linear()
      .range(["#EEDCEC", "#5E07A1"])
      .interpolate(d3.interpolateLab)
      .domain([min,max]);
  
  var projection = d3.geo.mercator()
      .scale((width + 1) / 2 / Math.PI)
      .translate([width / 2, height / 2])
      .precision(.1);
  
  var path = d3.geo.path()
      .projection(projection);
  
  var graticule = d3.geo.graticule();
  
  var svg = d3.select("#canvas-svg").append("svg")
      .attr("width", width)
      .attr("height", height);
  
  svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);
  
  function log10(val) {
    return Math.log(val);
  }
  function smallgraph() {
    var scale = d3.scale.linear()
        .domain([1, 5])   // Data space
        .range([0, 200]); // Pixel space

      var svg = d3.select("path").append("svg")
        .attr("width",  250)
        .attr("height", 250);

      function render(data, color){

        // Bind data
        var rects = svg.selectAll("rect").data(data);
        
        // Enter
        rects.enter().append("rect")
          .attr("y", 50)
          .attr("width",  20)
          .attr("height", 20);

        // Update
        rects
          .attr("x", scale)
          .attr("fill", color);
      }

      render([1, 2, 2.5],     "red");
      render([1, 2, 3, 4, 5], "blue");
      render([1, 2],          "green");
  }
  
  d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/world-topo-min.json", function(error, world) {
    var countries = topojson.feature(world, world.objects.countries).features;
  
    svg.append("path")
       .datum(graticule)
       .attr("class", "choropleth")
       .attr("d", path);
  
    var g = svg.append("g");
  
    g.append("path")
     .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
     .attr("class", "equator")
     .attr("d", path);
  
    var country = g.selectAll(".country").data(countries);
  
    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d) { return d.properties.name; })
        .style("fill", function(d) { 
            if (valueHash[d.properties.name]) {
                return color(valueHash[d.properties.name]);
            }
            else {
                return "#E1E1E4";
            }
          })   
        .on("mousemove", function(d) {
            var html = "";
  
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += d.properties.name;
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            html += (valueHash[d.properties.name] ? valueHash[d.properties.name] : "0");
            html += "";
            html += "</span>";
            html += "</div>";
            
            $("#tooltip-container").html(html);
            // $("#tooltip-container").html(smallgraph());
            $(this).attr("fill-opacity", "0.8");
            $("#tooltip-container").show();
            
            var coordinates = d3.mouse(this);
            
            var map_width = $('.choropleth')[0].getBoundingClientRect().width;
            
            if (d3.event.pageX < map_width / 2) {
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX + 15) + "px");
            } else {
              var tooltip_width = $("#tooltip-container").width();
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
            }
        })
        .on("mouseout", function() {
                $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
            });
    
    g.append("path")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
  });
  d3.select(self.frameElement).style("height", height + "px");
});
