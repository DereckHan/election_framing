var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var d3 = require('d3');

var barChartView = Backbone.View.extend({
    tagName: "div",
    el: "#barChart",
    initialize: function() {
        // this.$el.html(this.template(this.model.attributes));
    },
    /*show: function(model) {
      alert(model.get("data"));
    },*/
    template: _.template($("#barChartViewTemplate").html()),
    render: function(model) {
        //console.log(model);
        //console.log(model.get("data"));
        var chartWidth = 300,
            barHeight = 20,
            groupHeight = barHeight * 2, //2 scores
            gapBetweenGroups = 10,
            spaceForLabels = 150,
            spaceForLegend = 150;

        d3.json(model.get("data"), function(daysample) {
            //console.log(daysample);

            // Data processing
            var data = [];
            var compare = ["score1", "score2"];
            for (var i = 0; i < daysample.term_count; i++) {
                data.push(daysample.term_set[i].scores_1[0]);
                data.push(daysample.term_set[i].scores_2[0]);
            }
            console.log(data);

            // Color scale
            var color = ["#286090", "#31B0D5"];
            var chartHeight = barHeight * data.length + gapBetweenGroups * daysample.term_count;

            var x = d3.scale.linear()
                .domain([0, d3.max(data)])
                //.domain(d3.extent(data, function(d) { console.log(d); return d; }))
                .range([0, chartWidth]);
            //x.domain(d3.extent(data, function(d) { return d; })).nice();

            var y = d3.scale.linear()
                .range([chartHeight + gapBetweenGroups, 0]);
            y.domain(data.map(function(d, i) {
                if (i % 2 == 0)
                    return daysample.term_set[i / 2].term;
            }))

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .tickFormat('')
                .tickSize(0)
                .orient("left")
                .tickPadding(6);

            // Specify the chart area and dimensions
            var chart = d3.select(".chart")
                .attr("width", spaceForLabels + chartWidth + spaceForLegend)
                .attr("height", chartHeight)
                //.attr("transform", "translate(" + 30 + "," + 20 + ")");

            // Create bars
            var bar = chart.selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("x", function(d) {
                    return x(Math.min(0, d));
                })
                .attr("y", function(d, i) {
                    if (i % 2 == 0)
                        return daysample.term_set[i / 2].term;
                })
                .attr("transform", function(d, i) {
                    if (d > 0)
                        return "translate(" + (spaceForLabels + chartWidth / 2) + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / 2))) + ")";
                    else {
                        return "translate(" + (spaceForLabels + x(Math.min(0, d)) + chartWidth / 2) + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / 2))) + ")";
                    }
                });

            // Create rectangles of the correct width
            bar.append("rect")
                .attr("fill", function(d, i) {
                    return color[i % 2];
                })
                .attr("class", "bar")
                .attr("width", function(d) {
                    if (d > 0)
                        return x(d);
                    else
                        return -x(d);
                })
                .attr("height", barHeight - 1);

            // Add text label in bar
            bar.append("text")
                .attr("fill", "red")
                .attr("dy", ".35em")
                .text(function(d) {
                    return d;
                })
                .attr("transform", function(d, i) {
                    if (d > 0)
                        return "translate(" + (x(d) - 3) + "," + (barHeight / 2) + ")";
                    else {
                        return "translate(" + 28 + "," + (barHeight / 2) + ")";
                    }
                });

            // Draw labels
            bar.append("text")
                .attr("class", "label")
                .attr("x", function(d) {
                    return -spaceForLabels;
                })
                .attr("y", groupHeight / 2)
                .attr("dy", ".35em")
                .text(function(d, i) {
                    if (i % 2 === 0) {
                        return daysample.term_set[Math.floor(i / 2)].term;
                    } else
                        return ""
                })
                //.attr("transform", "translate(" + chartWidth/2 + "," + 0 + ")");

            // Draw x axis
            chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + chartHeight + ")")
                .call(yAxis);

            // Draw y axis
            chart.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + (spaceForLabels + chartWidth / 2) + ", " + -gapBetweenGroups / 2 + ")")
                //.attr("transform", "translate(" + x(0) + ",0)")
                .call(yAxis);
        });
        this.$el.html(this.template(this.model.attributes));
    }
});

module.exports = {
    barChartView: barChartView
};
