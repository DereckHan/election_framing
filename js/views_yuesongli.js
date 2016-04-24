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
        "change #option-1-select": "getOption1",
        "change #option-2-select": "getOption2",
        "click #bar-time-range li": "getTime",
        "click .bar1": "getKeyword",
        "click .bar2": "getKeyword",
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
        //var color = ["lightskyblue", "pink"];
        var color = ["#337ab7", "#5bc0de"];
        var att = model.attributes;
        // console.log(att);

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
                //console.log(i);
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
        /*var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0.0);*/

        //$("#bar-chart").html(_.template($("#barChartViewTemplate").html()));
        //$("#bar-chart").append("<svg class='barchart-view'></svg>");
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

        //d3.json(model.get("data"), function(data) {
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
        var data = (att["data"][att["category"]]).attributes;
        //console.log(data);
        var comparisons = [att["option_1"], att["option_2"]];
        //Process data
        var Data = [{}, {}, {}, {}, {}];

        for (i = 0; i < term_count; i++) {
            var time = att["time_range"];
            Data[i]["keyword"] = Object.keys(data[att["option_1"]][att["topic"]][time].term_set)[i];
            Data[i][att["option_1"]] = data[att["option_1"]][att["topic"]][time].term_set[Data[i]["keyword"]][29];
            Data[i][att["option_2"]] = data[att["option_2"]][att["topic"]][time].term_set[Data[i]["keyword"]][29];
        }
        //console.log(Data);

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
                    //console.log(string);
                    string = string + "<br>" + word[i];
                }
                //console.log(string);
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
                    //return -y(d[att["option_1"]]);
                } else {
                    return (height / 2 - y(-d[att["option_1"]]));
                    //return y(d[att["option_1"]]);
                }
            })
            /*.on('mouseover', function(d) {
                model.set({
                    "key": d.keyword
                });
                tip.show(d, 0);
                return (d.keyword);
            })*/
            .on("mouseover", tip1.show)
            .on('mouseout', tip1.hide);
            /*.on("mouseover", function(d) {
                model.set({
                    "key": d.keyword
                });
                var value = d[Object.keys(d)[1]].toFixed(2);
                var key = Object.keys(d)[1];
                console.log(d);
                tooltip.html(key + "<br />" + value)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0);
                tooltip.style("left", (d3.event.pageX) + "px");
            })
            .on("mouseleave", function() { tooltip.html(" ").style("display", "none"); });*/

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
            /*.on('mouseover', function(d) {
                model.set({ "key": d.keyword });
                tip.show(d);
                return (d.keyword);
            })*/
            .on('mouseover', tip2.show)
            .on('mouseout', tip2.hide);
            /*.on("mouseover", function(d) {
                model.set({
                    "key": d.keyword
                });
                var value = d[Object.keys(d)[2]].toFixed(2);
                var key = Object.keys(d)[2];
                console.log(d);
                tooltip.html(key + "<br />" + value)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0);
                tooltip.style("left", (d3.event.pageX) + "px");
            })
            .on("mouseleave", function() { tooltip.style("opacity", 0.0); });*/

        // Draw legend
        var legendRectSize = 18,
            legendWordSize = 45,
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
        //});
    },
    getTopic: function(event) {
        var selectTopic = $(event.currentTarget);
        this.model.set({
            "topic": selectTopic.parent()[0].id
        });
    },
    getCategory: function(event) {
        var selectCategory = event.currentTarget.value;
        // console.log(selectCategory);
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
        // console.log(selectOption1);
        this.model.set({
            "option_1": selectOption1
        });
    },
    getOption2: function(event) {
        var selectOption2 = event.currentTarget.value;
        // console.log(selectOption2);
        this.model.set({
            "option_2": selectOption2
        });
    },
    getTime: function(event) {
        var selectTime = event.currentTarget.id;
        // console.log(selectTime);
        this.model.set({
            "time_range": selectTime
        });
    },
    getKeyword: function(event) {
        var keymodel = this.model.attributes["keys"];
        var key = keymodel.attributes.term_selected[0];
        console.log(keymodel);
        var selectKey = this.model.attributes["key"];
        var keyset = [];
        keyset.push(selectKey);
        //keymodel.attributes.term_selected[0] = selectKey;
        keymodel.set({"term_selected": keyset});
        console.log(keymodel.attributes.term_selected[0]);
    },
    clear: function() {
        this.model.destroy();
        d3.select("svg").selectAll("g").remove();
    }
});

module.exports = {
    BarSetView: BarSetView
};
