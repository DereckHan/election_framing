var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var d3 = require('d3');

var LineSetView = Backbone.View.extend({
    collection: null,
    el: $(document).ready(function() {
        return $("#line-chart");
    }),
    render: function() {
        var margin = {
            top: 25,
            right: 25,
            bottom: 25,
            left: 30
        };

        var start = this.collection.attributes["begin_time"],
            end = new Date(this.collection.attributes["end_time"] - (24 * 60 * 60 * 1000));
        var mobile_threshold = 718,
            graphic_aspect_width = 16,
            graphic_aspect_height = 9,
            num_ticks_x = Math.round(Math.abs((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))),
            num_ticks_y = 5,
            width = $("#line-chart").width() - margin.left - margin.right,
            height = Math.ceil((width * graphic_aspect_height) / graphic_aspect_width) - margin.top - margin.bottom;
        // var color = d3.scale.category20();
        // var colors = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
        var colors = ["#337ab7", "#5bc0de"];

        var time_range = this.collection.attributes["time_range"];

        if (time_range === "week") {
            num_ticks_x = 8;
        }

        $("#line-chart").empty();

        var svg = d3.select('#line-chart').append('svg')
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
            .classed("svg-content-responsive", true)
            .attr("class", "linechart-view")
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // renderAxes(svg);
        var axesG = svg.append("g")
            .attr("class", "axes");

        // render xAxis    

        var xScale = d3.time.scale()
            .range([0, width])
            .domain([start, end]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(num_ticks_x)
            .tickFormat(function(d, i) {
                if (time_range == "week") {
                    var fmt = d3.time.format('%a');
                    return fmt(d);
                } else {
                    var fmt = d3.time.format('%e');
                    return fmt(d);
                }
            });

        axesG.append('g')
            .attr('class', 'xScale')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        // render yAxis
        var yScale = d3.scale.linear()
            .range([height, margin.top])
            .domain([-1, 1]);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(num_ticks_y);

        axesG.append('g')
            .attr('class', 'yScale')
            .call(yAxis)
            .append("text")
            .attr({
                x: -25,
                y: 0
            })
            .text("Sentimental Score: " + this.collection.models[0].get("key"));

        // add legend
        var legend = svg.append('g'),
            lineNames = this.collection.pluck("option"),
            shortNames = this.collection.pluck("shortName");

        var legendRectSize = 12,
            legendWordSize = 60,
            legendSpacing = 2;

        var unit = legendRectSize + legendWordSize + 2 * legendSpacing;

        legend.attr("class", "legend")
            .attr("transform", "translate(" + (width - (lineNames.length >= 5 ? 5 : lineNames.length) * unit) + "," + 0 + ")");

        legend.selectAll("text")
            .data(lineNames)
            .enter()
            .append("text")
            .text(function(d) {
                return d;
            })
            .attr({
                class: "legend",
                x: function(d, i) {
                    return ((i % 5) * unit + legendRectSize + legendSpacing);
                },
                y: function(d, i) {
                    if (i > 4) return 25;
                    return 5;
                },
                // fill: color
                fill: function(d, i) {
                    return colors[i];
                }
            });

        legend.selectAll("rect")
            .data(lineNames)
            .enter()
            .append("rect")
            .attr({
                x: function(d, i) {
                    return ((i % 5) * unit);
                },
                y: function(d, i) {
                    if (i > 4) return 15;
                    return -5;
                },
                width: legendRectSize,
                height: legendRectSize,
                // fill: color
                fill: function(d, i) {
                    return colors[i];
                }
            });

        body = svg.append("g")
            .attr("class", "body")
            .attr("clip-path", "url(#body-clip)");

        var lines = [];
        this.collection.models.forEach(function(model, id) {
            var line = [],
                current = start;
            for (i = 0; i < (time_range === "week" ? 8 : model.get("scoreArray").length); i++) {
                line.push({
                    date: current,
                    sentiment: model.get("scoreArray")[i]
                });
                current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
            }
            lines.push(line);
        })
        console.log(lines);

        // render lines and dots
        var line = d3.svg.line()
            .x(function(d) {
                return xScale(d.date);
            })
            .y(function(d) {
                return yScale(d.sentiment);
            })
            .interpolate('monotone');

        lines.forEach(function(l, i) {
            body.append("path")
                .datum(l)
                .attr("class", "line")
                .transition()
                .ease("elastic")
                .duration(1000)
                .delay(function(d, i) {
                    return 200 * i;
                })
                .style({
                    stroke: colors[i],
                    fill: "none"
                })
                .attr("d", line);

            circle = svg.append("g")
                .attr("class", "circle _" + i);

            circle.selectAll("circle._" + i)
                .data(l)
                .enter()
                .append("circle")
                .attr("class", "dot _" + i)
                .attr("value", function(d, i) {
                    return i;
                });

            circle.selectAll("circle._" + i)
                .data(l)
                .exit()
                .remove();

            circle.selectAll("circle._" + i)
                .data(l)
                .style("stroke", colors[i])
                .style({
                    stroke: colors[i],
                    fill: colors[i]
                })
                .transition()
                .duration(1000)
                .attr("cx", function(d) {
                    return xScale(d.date);
                })
                .attr("cy", function(d) {
                    return yScale(d.sentiment);
                })
                .attr("r", 3.5);
        });

        d3.selectAll("g.xScale g.tick")
            .append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", -height + margin.top);

        d3.selectAll("g.yScale g.tick")
            .append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0);

        $(".xScale .tick").each(function(i) {
            $($(".xScale .tick")[i]).attr("value", i);
        });

        // tip
        var tip = svg.append("g")
            .attr("class", "line-tip")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        tip.append("rect")
            .attr({
                class: "bg",
                width: 140,
                height: 80,
                rx: 2,
                ry: 2
            });
        tip.append("text")
            .attr({
                class: "point-time",
                x: 10,
                y: 25
            })
            .text("hhhh");
        lines.forEach(function(d, i) {
            var tipItem = tip.append("g")
                .attr("class", "tip-detail")
                .attr("transform", "translate(10," + (30 + i * 22) + ")");
            tipItem.append("g")
                .attr("class", "bg")
                .append("rect")
                .attr({
                    height: 20,
                    width: 120
                });

            tipItem.append("rect")
                .attr({
                    x: 5,
                    y: 5,
                    height: legendRectSize,
                    width: legendRectSize
                })
                .style("fill", colors[i]);

            tipItem.append("text")
                .attr({
                    x: (5 + legendRectSize + 5),
                    y: 16
                })
                .text(lineNames[i])
                .style("fill", "#666");

            tipItem.append("text")
                .attr("class", "score _" + i)
                .attr({
                    x: (5 + legendRectSize + 5 + legendWordSize + 10),
                    y: 16
                })
                .style("fill", "#666");
        })

        svg.append("defs")
            .append("clipPath")
            .attr("id", "body-clip")
            .append("rect")
            .attr("id", "play-ground")
            .attr("x", 0)
            .attr("y", margin.top)
            .attr("width", width)
            .attr("height", height - margin.bottom);

    },
    modifyTips: function() {
        var id = $("g .circle").attr("value");
        $("circle[value=" + id + "]").each(function() {
            $(this).attr("r", 6);
        });
        console.log(this);
    },
    // recoverTips: function() {
    //     var id = $("g .circle").attr("value");
    //     $("circle[value=" + id + "]").each(function() {
    //         $(this).attr("r", 3.5);
    //     });
    // },
    showTips: function() {
        $(".line-tip").fadeIn();
    },
    removeTips: function() {
        $(".line-tip").fadeOut();
    }


});

module.exports = {
    LineSetView: LineSetView
};
