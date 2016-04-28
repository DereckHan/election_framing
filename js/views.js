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

        var legendRectSize = 12,
            legendCharLength = 2,
            legendSpacing = 2,
            endBuffer = 10;

        var lineNames = this.collection.pluck("option"),
            shortNames = this.collection.pluck("shortName");

        var legendG = svg.append('g')
            .attr("class", "legend");

        var legend = legendG.selectAll(".legend _" + i)
            .data(lineNames)
            .enter()
            .append("g")
            .attr('transform', function(d, i) {
                var shiftUnits = 0;
                for (j = 1; j >= i; j--) {
                    shiftUnits += lineNames[j].length;
                }
                var legend_height = legendRectSize + legendSpacing;
                var legend_width = legendRectSize + shiftUnits * legendCharLength + endBuffer;
                var horz = width + (i - 2) * (legend_width + legendSpacing * 2) - margin.right;
                return 'translate(' + horz + ',0)';
            })
        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', function(d, i) {
                return colors[i];
            })
            .style('stroke', function() {
                return colors[i];
            })
        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d, i) {
                return lineNames[i];
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
        });
        // console.log(lines);

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
                .attr("index", function(d, i) {
                    return i;
                })
                .attr("value", function(d) {
                    return d.sentiment;
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
            $($(".xScale .tick")[i]).attr("index", i);
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
            });
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

            // tipItem.append("text")
            //     .attr("class", "score _" + i)
            //     .attr({
            //         x: (5 + legendRectSize + 5 + legendWordSize + 5),
            //         y: 16
            //     })
            //     .style("fill", "#666");
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
        var id = $(this).attr("index"),
            scores = [];
        $("circle[index=" + id + "]").each(function() {
            $(this).attr("r", 6);
            scores.push($(this).attr("value"));
        });
        $(".point-time").html($(this).children("text").html());
        $(".tip-detail .score").each(function(i) {
            var len = (scores[i].charAt(0) === "-") ? 5 : 4;
            $(this).html(scores[i].substr(0, len));
        });
    },
    recoverTips: function() {
        var id = $(this).attr("index");
        $("circle[index=" + id + "]").delay(1000).each(function() {
            $(this).attr("r", 3.5);
        });
    },
    showTips: function() {
        $(".line-tip").fadeIn();
    },
    removeTips: function() {
        $(".line-tip").fadeOut();
    }

});

var BarSetView = Backbone.View.extend({
    el: $(document).ready(function() {
        $("#bar-chart")
    }),
    events: {
        "change input[type=radio]": "getTopic",
        "change #select-category": "getCategory",
        "change #option-1-select": "getOption1",
        "change #option-2-select": "getOption2",
        "click #bar-time-range li": "getTime",
        "click .bar1": "getKeyword",
        "click .bar2": "getKeyword",
    },
    initialize: function() {
        //this.$el.html(this.template(this.model.attributes));
    },
    template: _.template($("#barChartViewTemplate").html()),
    render: function(model) {
        var term_count = 5;
        var color = ["#337ab7", "#5bc0de"];
        var att = model.attributes;


        var margin = {
                top: 50,
                right: 80,
                bottom: 70,
                left: 30
            },
            width = 680 - margin.left - margin.right,
            height = 340 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
        var y = d3.scale.linear().domain([0, width + margin.left + margin.right]).range([height, 0]);
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        // create left yAxis
        var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");

        // tip
        var tip1 = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d, i) {
                model.attributes["key"] = d.keyword;
                var value = d[Object.keys(d)[1]].toFixed(2);
                return "<strong> <span style='color:" + color[0] + "'>" + Object.keys(d)[1] + ": <br> </strong>" + value + "</span>";
            });
        var tip2 = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                model.attributes["key"] = d.keyword;
                var value = d[Object.keys(d)[2]].toFixed(2);
                return "<strong> <span style='color:" + color[1] + "'>" + Object.keys(d)[2] + ": <br> </strong>" + value + "</span>";
            });

        var svg = d3.select(".barchart-view")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 620 290")
            .classed("svg-content-responsive", true)
            .append("g")
            .attr("class", "graph")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip1);
        svg.call(tip2);

        var data = (att["data"][att["category"]]).attributes;

        var comparisons = [att["option_1"], att["option_2"]];
        //Process data
        var Data = [{}, {}, {}, {}, {}];

        for (i = 0; i < term_count; i++) {
            var time = att["time_range"];
            Data[i]["keyword"] = Object.keys(data[att["option_1"]][att["topic"]][time].term_set)[i];
            Data[i][att["option_1"]] = data[att["option_1"]][att["topic"]][time].term_set[Data[i]["keyword"]][29];
            Data[i][att["option_2"]] = data[att["option_2"]][att["topic"]][time].term_set[Data[i]["keyword"]][29];
        }

        // svg domain
        x.domain(Data.map(function(d) {
            return d.keyword;
        }));
        y.domain([-1, 1]);

        xAxis.tickValues(Data.map(function(d) {
                return d.keyword;
            }))
            .tickFormat(function(d) {
                var word = d.split(" ");
                var string = word[0];
                for (i = 1; i < word.length; i++) {
                    string = string + "<br>" + word[i];
                }
                return d;
            });
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis axisLeft")
            .attr("transform", "translate(0,0)")
            .call(yAxisLeft)
            .append("text")
            .attr("y", 6)
            .attr("dy", "-2em")
            .attr("dx", "6em")
            .style("text-anchor", "end")
            .text("Sentimental Score");

        // bars
        bars = svg.selectAll(".bar").data(Data).enter();
        bars.append("rect")
            .attr("class", "bar1")
            .attr("x", function(d) {
                return x(d.keyword);
            })
            .attr("width", x.rangeBand() / 2)
            .attr("y", function(d) {
                if (d[att["option_1"]] > 0) {
                    return y(d[att["option_1"]]);
                } else
                    return height / 2;
                return y(Math.min(0, d[att["option_1"]]));
            })
            .attr("height", function(d) {
                if (d[att["option_1"]] > 0) {
                    return (height / 2 - y(d[att["option_1"]]));
                } else {
                    return (height / 2 - y(-d[att["option_1"]]));
                }
            })
            .on("mouseover", tip1.show)
            .on('mouseout', tip1.hide);

        bars.append("rect")
            .attr("class", "bar2")
            .attr("x", function(d) {
                return x(d.keyword) + x.rangeBand() / 2;
            })
            .attr("width", x.rangeBand() / 2)
            .attr("y", function(d) {
                if (d[att["option_2"]] > 0) {
                    return y(d[att["option_2"]]);
                } else
                    return height / 2;
            })
            .attr("height", function(d) {
                if (d[att["option_2"]] > 0)
                    return (height / 2 - y(d[att["option_2"]]));
                else
                    return (height / 2 - y(-d[att["option_2"]]));
            })
            .on('mouseover', tip2.show)
            .on('mouseout', tip2.hide);

        // Draw legend
        var legendRectSize = 12,
            legendCharLength = 2,
            legendSpacing = 2;

        var legend = bars.append("g")
            .attr("class", "legend")
            .data(comparisons)
            .attr('transform', function(d, i) {
                var shiftUnits = 0;
                for (j = 1; j >= i; j--) {
                    shiftUnits += comparisons[j].length;
                }
                var legend_height = legendRectSize + legendSpacing;
                var legend_width = legendRectSize + shiftUnits * legendCharLength + legendSpacing * 4;
                var horz = width + (i - 2) * (legend_width + legendSpacing * 2) - 25;
                return 'translate(' + horz + ',' + -(legendRectSize * 2) + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', function(d, i) {
                return color[i % 2];
            })
            .style('stroke', function(d, i) {
                return color[i % 2];
            });

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d, i) {
                return comparisons[i % 2];
            });
    },
    getTopic: function(event) {
        var selectTopic = $(event.currentTarget);
        this.model.set({
            "topic": selectTopic.parent()[0].id
        });
    },
    getCategory: function(event) {
        var selectCategory = event.currentTarget.value;
        if (selectCategory == "Parties") {
            this.model.set({
                "category": selectCategory,
                "option_1": "Democratic",
                "option_2": "Republican"
            });
        } else if (selectCategory == "Candidates") {
            this.model.set({
                "category": selectCategory,
                "option_1": "Hillary Clinton",
                "option_2": "Bernie Sanders"
            });
        } else {
            this.model.set({
                "category": selectCategory,
                "option_1": "Alabama",
                "option_2": "Alaska"
            });
        }
    },
    getOption1: function(event) {
        var selectOption1 = event.currentTarget.value;
        this.model.set({
            "option_1": selectOption1
        });
    },
    getOption2: function(event) {
        var selectOption2 = event.currentTarget.value;
        this.model.set({
            "option_2": selectOption2
        });
    },
    getTime: function(event) {
        var selectTime = event.currentTarget.id;
        this.model.set({
            "time_range": selectTime
        });
    },
    getKeyword: function(event) {
        var keymodel = this.model.attributes["keys"];
        var key = keymodel.attributes.term_selected[0];
        var selectKey = this.model.attributes["key"];
        var keyset = [];
        keyset.push(selectKey);
        keymodel.set({
            "term_selected": keyset
        });
    },
    clear: function() {
        this.model.destroy();
        d3.select("svg").selectAll("g").remove();
    }
});

module.exports = {
    LineSetView: LineSetView,
    BarSetView: BarSetView
};
