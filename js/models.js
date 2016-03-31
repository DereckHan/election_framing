var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var url_root = '';

var Conditions = Backbone.Model.extend({
    defaults: {
        topic: 0,
        category: "States",
        option_1: "Pennsylvania",
        option_2: "Washington",
        url: "../data/",
        data: "../data/state.json"
    },
    constructor: function() {
        arguments.parse = true;
        Backbone.Model.apply(this, arguments);
    },
});

var Categories = Backbone.Model.extend({
    initialize: function() {
        $.getJSON();

    },
});

module.exports = {
    Conditions: Conditions
};
