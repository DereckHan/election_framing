var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var d3 = require('d3');

var BarSetView = Backbone.View.extend({
    //tagName: "div",
    //id: "bar-chart",
    el: $(document).ready(function() {
        //console.log($("#bar-chart")); 
        $("#bar-chart")
    }),
    events: {
        "change input[type=radio]": "getTopic",
        "change #select-category": "getCategory",
        "click #option-1-menu": "getOption1",
        "click #option-2-menu": "getOption2",
        "click li a": "getTime",
    },
    initialize: function() {
        //this.$el.html(this.template(this.model.attributes));
    },
    /*show: function(model) {
      alert(model.get("data"));
    },*/
    template: _.template($("#barChartViewTemplate").html()),
    render: function(model) {
        var term_count = 5;
        var color = ["lightskyblue", "pink"];
        var att = model.attributes;
        // x console.log(att);
        // x console.log(model.get("data"));

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
                // x console.log(i);
                return "<strong>" + Object.keys(d)[1] + ": <br> </strong> <span style='color:" + color[0] + "'>" + d[Object.keys(d)[1]] + "</span>";
            })
        var tip2 = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d, i) {
                // x console.log(i);
                return "<strong>" + Object.keys(d)[2] + ": <br> </strong> <span style='color:" + color[1] + "'>" + d[Object.keys(d)[2]] + "</span>";
            })

        var svg = d3.select(".barchart-view")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 620 290")
            .classed("svg-content-responsive", true)
            .append("g")
            .attr("class", "graph")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //svg.selectAll(".bar").remove();
        svg.call(tip1);
        svg.call(tip2);

        d3.json(model.get("data"), function(data) {
            // x console.log(data);
            // if (att["category"] == "Parties") {
            //     att["option_1"] = "Democrat";
            //     att["option_2"] = "Republican";
            // } else if (att["category"] == "Candidates") {
            //     att["option_1"] = "Hillary Clinton";
            //     att["option_2"] = "Ted Cruz";
            // } else {
            //     att["option_1"] = "Pennsylvania";
            //     att["option_2"] = "Washington";
            // }
            var comparisons = [att["option_1"], att["option_2"]];
            //Process data
            var Data = [{}, {}, {}, {}, {}];
            for (i = 0; i < term_count; i++) {
                Data[i]["keyword"] = Object.keys(data[att["option_1"]][att["topic"]]["day"].term_set)[i];
                Data[i][att["option_1"]] = data[att["option_1"]][att["topic"]]["day"].term_set[Data[i]["keyword"]][29];
                Data[i][att["option_2"]] = data[att["option_2"]][att["topic"]]["day"].term_set[Data[i]["keyword"]][29];
            }
            // x console.log(Data);

            // svg domain
            x.domain(Data.map(function(d) {
                return d.keyword;
            }));
            y.domain([-1, 1]);

            // x axis and y axis
            /*svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);*/
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
                        //return -y(d[att["option_1"]]);
                    } else {
                        return (height / 2 - y(-d[att["option_1"]]));
                        //return y(d[att["option_1"]]);
                    }
                })
                .on('mouseover', tip1.show)
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
            var legendRectSize = 18,
                legendWordSize = 40,
                legendSpacing = 4;

            var legend = bars.append("g")
                .attr("class", "legend")
                .data(comparisons)
                .attr('transform', function(d, i) {
                    var legend_height = legendRectSize + legendSpacing;
                    var legend_width = (legendRectSize + legendWordSize) * 2;
                    var horz = width + (i - 2) * (legend_width + legendSpacing * 2);
                    //var vert = i * height - offset;
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
                .attr('class', 'legend')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .text(function(d, i) {
                    return comparisons[i % 2];
                });
        });
        //svg.selectAll(".legend").remove();
        //svg.selectAll(".bar").remove();
        //d3.select("svg").remove();
        //this.$el.html(this.template(this.model.attributes));
    },
    getTopic: function(event) {
        var selectTopic = $(event.currentTarget);
        // x console.log(selectTopic.parent()[0].id);
        /*var Topics = ["eco", "ter", "fed", "equ", "hea", "imm", "env", "gun"];
        var i = 0;
        for (i = 0; i < 8; i++) {
            if (Topics[i] == selectTopic[0].id) 
                break;
        }*/
        this.model.set({ "topic": selectTopic.parent()[0].id });
        // x console.log(this.model.get("topic"));
    },
    getCategory: function(event) {
        var selectCategory = event.target.value;
        // x console.log(selectCategory);
        this.model.set({ "category": selectCategory });
        this.model.set({ "data": this.model.get('url') + "state_full.json" });
        if (this.model.get("category") == "Parties") {
            this.model.set({ "data": this.model.get('url') + "party_full.json" });
        } else if (this.model.get("category") == "Candidates") {
            this.model.set({ "data": this.model.get('url') + "candidate_full.json" });
        }
    },
    clear: function() {
        this.model.destroy();
        d3.select("svg").selectAll("g").remove();
    }
});

module.exports = {
    BarSetView: BarSetView
};
