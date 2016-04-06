var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var d3 = require('d3');

var LineView = Backbone.View.extend({
    //tagName: "div",
    //id: "bar-chart",
    el: $(document).ready(function() {
        //console.log($("#bar-chart")); 
        $("#line-chart")
    }),
    events: {

    },
    initialize: function() {
        //this.$el.html(this.template(this.model.attributes));
    },
    /*show: function(model) {
      alert(model.get("data"));
    },*/
    template: _.template($("#lineChartViewTemplate").html()),
    render: function(model) {
        var keyword = "China";
        var option = ["week", "month"];
        var term_count = 5;
        var states = ["Alabama", "Alaska"];
        var format = d3.time.format("%Y-%m-%d");

        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 50
            },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        //var formatDate = d3.time.format("%d-%b-%y");

        var svg = d3.select(".linchart-view")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(10);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        d3.json("../data/state.json", function(data) {
            console.log(data);
            var Data = [{}, {}, {}, {}, {}];
            var time = data.time;
            var timeType = option[0];
            for (i = 0; i < term_count; i++) {
                Data[i]["keyword"] = data.state_set[0][states[0]].topic_set[0].time_set[0].term_set[i];
                date = data.state_set[0][states[0]].topic_set[0].time_set[1].begin_time;
                date_split = date.split("/");
                Data[i]["score_set"] = [];
                for (j = 0; j < 30; j++) {
                    Data[i]["score_set"].push(new Object);
                    if (j != 0) {
                        if (date_split[0] - 1 > 0) {
                            date_split[0] = date_split[0] - 1;
                        } else {
                            date_split[1] = date_split[1] - 1;
                            date_split[1] = "0" + date_split[1];
                            if (date_split[1] == 1 || date_split[1] == 3 || date_split[1] == 5 || date_split[1] == 7 || date_split[1] == 8 || date_split[1] == 10 || date_split[1] == 12)
                                date_split[0] = 31;
                            else if (date_split[1] == 2) {
                                date_split[0] = 29;
                            } else
                                date_split[0] = 30;
                        }
                    }
                    date_new = date_split[2] + "-" + date_split[1] + "-" + date_split[0];
                    //console.log(date_new);
                    Data[i]["score_set"][j]["date"] = format.parse(date_new);
                    Data[i]["score_set"][j]["score_1"] = data.state_set[0][states[0]].topic_set[0].time_set[0].term_set[i].score_set[j];
                    Data[i]["score_set"][j]["score_2"] = data.state_set[1][states[1]].topic_set[0].time_set[0].term_set[i].score_set[j];
                }
            }
            console.log(Data[0].score_set);

            x.domain(d3.extent(Data[0].score_set, function(d) {
                //console.log(d.date);
                return d.date;
            }));
            /*y.domain(d3.extent(Data[0].score_set, function(d) {
                return d.score_1;
            }));*/
            y.domain([-1, 1]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .text("date")
                .attr("transform", "translate(" + width + ", 0)");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Sentimental score");

            var line = d3.svg.line()
                .x(function(d) {
                    return x(d.date);
                })
                .y(function(d, i) {
                    console.log(i);
                    console.log(d);
                    return y(d.score_1);
                });

            var path = svg.append("path")
                //.datum(Data[0].score_set)
                .attr("class", "line")
                .attr("d", line(Data[0].score_set));

            var g = svg.selectAll('circle')
                .data(Data[0].score_set)
                .enter()
                .append('g')
                .append('circle')
                .attr('class', 'linecircle')
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', 3.5)
                .on('mouseover', function() {
                    d3.select(this).transition().duration(500).attr('r', 5);
                })
                .on('mouseout', function() {
                    d3.select(this).transition().duration(500).attr('r', 3.5);
                });
        });
    }
});

module.exports = {
    LineView: LineView
};
