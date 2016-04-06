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
        "click li a": "getCategory",
        "click #option-1-menu": "getOption1",
        "click #option-2-menu": "getOption2"
    },
    initialize: function() {
        //this.$el.html(this.template(this.model.attributes));
    },
    /*show: function(model) {
      alert(model.get("data"));
    },*/
    template: _.template($("#barChartViewTemplate").html()),
    render: function(model) {
        var margin = {
                top: 50,
                right: 80,
                bottom: 70,
                left: 30
            },
            width = 680 - margin.left - margin.right,
            height = 340 - margin.top - margin.bottom;
        /*var aspect = 680 / 340,
            chart = $("#bar-chart");

        $(window).on("resize", function() {
            var targetWidth = chart.parent().width();
            //width = targetWidth;
            //height = targetWidth / aspect;
            //console.log(width);
        });*/

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
        var y = d3.scale.linear().domain([0, width + margin.left + margin.right]).range([height, 0]),
            y1 = d3.scale.linear().domain([0, width + margin.left + margin.right]).range([height, 0]);
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        // create left yAxis
        var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");


        var svg = d3.select(".barchart-view")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 620 290")
            .classed("svg-content-responsive", true)
            .append("g")
            .attr("class", "graph")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //svg.selectAll(".bar").remove();

        var term_count = 5;
        var comparisons = [];
        var states = ["Alabama", "Alaska"];
        var parties = ["Democrat", "Republican"];
        var candidates = ["Hillary Clinton", "Ted Cruz"];

        var topic = model.get('topic');

        var color = ["steelblue", "red"];

        d3.json(model.get("data"), function(data) {
            console.log(data);
            //Process data
            var Data = [{}, {}, {}, {}, {}];
            if (model.get("category") == "States") {
                for (i = 0; i < term_count; i++) {
                    Data[i]["keyword"] = data.state_set[0][states[0]].topic_set[0].time_set[0].term_set[i].term;
                    Data[i][states[0]] = data.state_set[0][states[0]].topic_set[0].time_set[0].term_set[i].score_set[29];
                    Data[i][states[1]] = data.state_set[1][states[1]].topic_set[0].time_set[0].term_set[i].score_set[29];
                    comparisons = states;
                }
            } else if (model.get("category") == "Parties") {
                for (i = 0; i < term_count; i++) {
                    Data[i]["keyword"] = data.party_set[0][parties[0]].topic_set[0].time_set[0].term_set[i].term;
                    Data[i][parties[0]] = data.party_set[0][parties[0]].topic_set[0].time_set[0].term_set[i].score_set[29];
                    Data[i][parties[1]] = data.party_set[1][parties[1]].topic_set[0].time_set[0].term_set[i].score_set[29];
                    comparisons = parties;
                }
            } else {
                for (i = 0; i < term_count; i++) {
                    Data[i]["keyword"] = data.candidate_set[0][candidates[0]].topic_set[0].time_set[0].term_set[i].term;
                    Data[i][candidates[0]] = data.candidate_set[0][candidates[0]].topic_set[0].time_set[0].term_set[i].score_set[29];
                    Data[i][candidates[1]] = data.candidate_set[1][candidates[1]].topic_set[0].time_set[0].term_set[i].score_set[29];
                    comparisons = candidates;
                }
            }
            //console.log(Data);

            // svg domain
            x.domain(Data.map(function(d) {
                return d.keyword;
            }));
            y.domain([-1, 1]);
            y1.domain([0, 1]);

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
                    //console.log(d[comparisons[0]]);
                    if (d[comparisons[0]] < 0) {
                        return height / 2;
                    } else
                        return height / 2 - y(-d[comparisons[0]]) / 2;
                })
                .attr("height", function(d, i, j) {
                    if (d[comparisons[0]] < 0)
                        return y(d[comparisons[0]]) / 2;
                    else
                        return y(-d[comparisons[0]]) / 2;
                });
            bars.append("rect")
                .attr("class", "bar2")
                .attr("x", function(d) {
                    return x(d.keyword) + x.rangeBand() / 2;
                })
                .attr("width", x.rangeBand() / 2)
                .attr("y", function(d) {
                    if (d[comparisons[1]] < 0) {
                        return height / 2;
                    } else
                        return height / 2 - y(-d[comparisons[1]]) / 2;
                })
                .attr("height", function(d, i, j) {
                    if (d[comparisons[1]] < 0)
                        return y(d[comparisons[1]]) / 2;
                    else
                        return y(-d[comparisons[1]]) / 2;
                });

            // Draw legend
            var legendRectSize = 18,
                legendWordSize = 30,
                legendSpacing = 4;

            var legend = bars.append("g")
                .attr("class", "legend")
                .data(comparisons)
                .attr('transform', function(d, i) {
                    var legend_height = legendRectSize + legendSpacing;
                    var legend_width = (legendRectSize + legendWordSize) * 2;
                    var horz = width - (i + 1) * (legend_width + legendSpacing * 2);
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
        console.log(selectTopic);
        var Topics = ["Economy", "Foreign Policy", "Federal Budget", "Equality", "Health Care", "Immigration", "Environment", "Guns"];
        var i = 0;
        for (i = 0; i < 8; i++) {
            if (Topics[i] == selectTopic[0].labels[0].childNodes[1].nextSibling.data)
                break;
        }
        this.model.set({ "topic": i });
        //console.log(this.model.get("topic"));
    },
    getCategory: function(event) {
        //console.log(event);
        var selectCategory = $(event.currentTarget);
        //console.log(selectCategory[0].childNodes[0].data);
        this.model.set({ "category": selectCategory[0].childNodes[0].data });
        //console.log(this.model.get("category") == "States");
        this.model.set({ "data": this.model.get('url') + "state.json" });
        if (this.model.get("category") == "Parties")
            this.model.set({ "data": this.model.get('url') + "party.json" });
        else if (this.model.get("category") == "Candidates")
            this.model.set({ "data": this.model.get('url') + "candidate.json" });
        //console.log(this.model.get("data"));
    },
    clear: function() {
        this.model.destroy();
        d3.select("svg").selectAll("g").remove();
    }
});

module.exports = {
    BarSetView: BarSetView
};
