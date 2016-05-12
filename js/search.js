domain_map = {
    'rank': [100, 0], 'totoal_score': [0, 100], 'teaching': [0, 100], 'research': [0, 100], 'citations': [0, 100],
    'international_students': [0, 100]
}
svg_map = {
    'rank': '#s1', 'totoal_score': '#s2', 'teaching': '#s3', 'research': '#s4', 'citations': '#s5',
    'international_students': '#s6'
}
d3.csv("metadata/timesData.csv", function (err, data) {

    var universities = {};
    var international_student_min = 100;
    var international_student_max = -1;
    data.forEach(function (d) {
        d.year = +d.year;
        d.world_rank = +d.world_rank;
        d.total_score = +d.total_score;
        d.teaching = +d.teaching;
        d.international_students = +d.international_students;
        d.research = +d.research;
        d.citations = +d.citations;

        if (!(d.university_name in universities)) {
            universities[d.university_name] = {
                'rank': [], 'totoal_score': [], 'teaching': [], 'research': [], 'citations': [],
                'international_students': []
            }
        }
        universities[d.university_name]['rank'].push({year: d.year, val: d.world_rank});
        universities[d.university_name]['totoal_score'].push({year: d.year, val: d.total_score});
        universities[d.university_name]['teaching'].push({year: d.year, val: d.teaching});
        universities[d.university_name]['international_students'].push({year: d.year, val: d.international_students});
        universities[d.university_name]['research'].push({year: d.year, val: d.research});
        universities[d.university_name]['citations'].push({year: d.year, val: d.citations});
        international_student_min = Math.min(international_student_min, d.international_students);
        international_student_max = Math.max(international_student_max, d.international_students);
    });
    var option_select1 = d3.select('#selectors1').append("select")
        .attr("class", "option-select")
        .style("font-size","13px")
        .style("font-weight","normal");
    var option_select2 = d3.select('#selectors2').append("select")
        .attr("class", "option-select")
        .style("font-size","13px")
        .style("font-weight","normal");
    var fields = Object.keys(universities);
    for (var i = 0; i < fields.length; i++) {
        var opt1 = option_select1.append("option")
            .attr("value", fields[i])
            .text(fields[i]);
        if (fields[i] === "Harvard University") {
            opt1.attr("selected", "true");
        }
        var opt2 = option_select2.append("option")
            .attr("value", fields[i])
            .text(fields[i]);
        if (fields[i] === "Peking University") {
            opt2.attr("selected", "true");
        }
    }

    var margin = {top: 20, right: 20, bottom: 40, left: 80};
    var width = window.innerWidth * 0.3 - margin.left - margin.right;
    var height = 200 - margin.top - margin.bottom;
    // var legendLeft = 600 - margin.right;
    var legendTop = margin.top;
    var legendRectSize = 8;
    var legendSpacing = 10;

    var xScale = d3.scale.linear()
        .range([0, width]);


    var yScale = d3.scale.linear()
        .range([height, 0]);

    //var color = d3.scale.category10();
    var color = d3.scale.ordinal().range(["#516DFF","#b300b3"]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    var line = d3.svg.line()
        //.interpolate("basis")
        .x(function (d) {
            return xScale(+d.year);
        })
        .y(function (d) {
            return yScale(+d.val);
        });


    function drawlinegraph(u1, u2, aspect) {

        var svg = d3.select(svg_map[aspect]).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // u = [u1,u2]
        color.domain([u1, u2]);
        var univers = [{name: u1, values: universities[u1][aspect]},
            {name: u2, values: universities[u2][aspect]}];
        //create dots data
        var dots_data = [];
        for(var i = 0; i < univers.length; i++){
            var scores = univers[i];
            for (var j = 0; j < scores.values.length; j++){
                dots_data.push({name: scores.name, year:scores.values[j].year, val:scores.values[j].val});
            }
        }
        // console.log(univers);
        // x.domain([2011,2016]);
        xScale.domain(d3.extent(data, function (d) {
            return d.year;
        }));
        yScale.domain(domain_map[aspect]);
        var tooltip = d3.select(svg_map[aspect]).append("div")
            .attr("class", "sm_tooltip")
            .style("opacity", 0);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width / 2)
            .attr("y", 35)
            .style("text-anchor", "end")
            .style("font-size","13px")
            .text("Year");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "translate(-" + 30 + "," + (height / 2) + ") rotate(-90)")
            .attr("class", "label")
            .style("text-anchor", "middle")
            .style("font-size","13px")
            .text(aspect);


        var univer = svg.selectAll(".univer")
            .data(univers)
            .enter().append("g")
            .attr("class", "univer");

        univer.append("path")
            .attr("class", "line")
            .attr("d", function (d) {
                return line(d.values);
            })
            .style("stroke", function (d) {
                return color(d.name);
            });
        // var legend = svg.selectAll('.legend')
        //     .data(color.domain())
        //     .enter()
        //     .append('g')
        //     .attr('class', 'legend')
        //     .attr('transform', function(d, i) {
        //         var height = legendRectSize + legendSpacing;
        //         var offset =  height * color.domain().length / 2;
        //         var horz = legendLeft;
        //         var vert = legendTop + i * height ;
        //         return 'translate(' + horz + ',' + vert + ')';
        //     });
        // legend.append('rect')
        //     .attr('width', legendRectSize)
        //     .attr('height', legendRectSize)
        //     .style('fill', color)
        //     .style('stroke', color);
        // legend.append('text')
        //     .attr('x', legendRectSize + legendSpacing)
        //     .attr('y', legendRectSize)
        //     .style("font-size","11px")
        //     .text(function(d) { return d; });
        svg.selectAll(".dot")
            .data(dots_data)
            .enter().append("circle")
            .attr("class", "datapoint")
            .attr("r", 2)
            .attr("cx", function (d) {
                return xScale(d.year);
            })
            .attr("cy", function (d) {
                return yScale(d.val);
            })
            .attr("fill", function (d) {
                return color(d.name);
            })
            .on("mouseover", function (d) {
                //console.log(d.val);
                tooltip.transition()
                    .duration(200)
                    .style("opacity",.9);
                tooltip.html(d.val)
                    .style("left", (parseInt(d3.select(this).attr("cx"))+ 50) + "px")
                    .style("top", (parseInt(d3.select(this).attr("cy")) - height -65) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            });

    }

    aspects = ['rank', 'totoal_score', 'teaching', 'research', 'citations', 'international_students']
    for (var i = 0; i < aspects.length; i++) {
        drawlinegraph("Harvard University", "Peking University", aspects[i])
    }
    d3.select("#submit")
        .on("click", function (d) {
            d3.event.preventDefault();
            for (var i = 0; i < aspects.length; i++) {
                $(svg_map[aspects[i]]).html("");
                drawlinegraph($("#selectors1").find(".option-select").val(), $("#selectors2").find(".option-select").val(), aspects[i]);
            }
        })

});