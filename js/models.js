var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var url_root = '';

var Conditions = Backbone.Model.extend({
    defaults: {
        majorCategory: "States",
        optionOne: "stateOne",
        optionTwo: "stateTwo",
        topic: "enj",
        time: "03/21/2016"
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
