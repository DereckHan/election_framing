/*************** 
 * Dependencies 
 ***************/
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var root_url = "../",
    state_file_path = "data/state_full.json",
    party_file_path = "data/party_full.json",
    candidate_file_path = "data/candidate_full.json";

/*************** 
 * Models 
 ***************/
var Conditions = Backbone.Model.extend({
    defaults: {
        topic: "eco",
        category: "States",
        option_1: "Pennsylvania",
        option_2: "Washington",
        time_range: "day",
        url: "../data/",
        data: "../data/state_full.json"
    },
});

var Line = Backbone.Model.extend({
    defaults: {
        keyword: "",
        datapoints: [],
    },
    initialize: function() {
        // load data from server.
    },
    conditionChange: function(conditions) {
        // call when conditions changed
        // reload parameters from server.
    },

    constructor: function() {
        arguments.parse = true;
        Backbone.Model.apply(this, arguments);
    }
});

var Categories = Backbone.Model.extend({
    initialize: function() {
        $.getJSON();

    }
});

var Keywords = Backbone.Model.extend({
    initialize: function() {

    }
});

var State = Backbone.Model.extend({
    url: root_url + state_file_path,
    initialize: function() {}
});

var Candidate = Backbone.Model.extend({
    url: root_url + candidate_file_path,
    initialize: function() {}
});

var Party = Backbone.Model.extend({
    url: root_url + party_file_path,
    initialize: function() {}
});


/***************
 * Collections 
 ***************/
var LineSet = Backbone.Collection.extend({
    model: Line

});

/***************
 * exports
 ***************/
module.exports = {
    Conditions: Conditions,
    Line: Line,
    Categories: Categories,
    Keywords: Keywords,
    State: State,
    Candidate: Candidate,
    Party: Party,
    LineSet: LineSet
};
