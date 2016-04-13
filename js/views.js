var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var d3 = require('d3');

var LineSetView = Backbone.View.extend({

    el: $(document).ready(function() {
        //console.log($("#bar-chart")); 
        $("line-chart")
    }),
    constructor: function(conditions, data) {
        this.model = conditions;
        this.dataset = data;
        this.render();
    },
    template: _.template($("#barChartViewTemplate").html()),
    render: function() {
        var category = this.model.get("category"),
            option_1 = this.model.get("option_1"),
            option_2 = this.model.get("option_2"),
            topic = this.model.get("topic"),
            time_range = this.model.get("time_range");
        var line_1 = this.dataset[category].attributes[option_1][topic][time_range]["term_set"],
            line_2 = this.dataset[category].attributes[option_2][topic][time_range]["term_set"];
    }
});

module.exports = {
    LineSetView: LineSetView
};
