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
        option_1: "Alabama",
        option_2: "Alaska",
        time_range: "day",
        url: "../data/",
        data: "../data/state_full.json"
    },
    initialize: function() {
        this.set("option_1", $("div#option-1 select").val());
        this.set("option_2", $("div#option-2 select").val());
        this.set("topic", $("div#topic label").attr("id"));
        this.set("category", $("div#category select").val());
        this.set("time_range", $(".nav.nav-tabs.nav-justified li.active a").html().toLowerCase());
    }
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
    initialize: function() {}
});

var Keywords = Backbone.Model.extend({
    constructor: function(conditions, data) {
        this.loadNewKeys(conditions, data);
    },
    loadNewKeys: function(conditions, data) {
        var topic = conditions.get("topic"),
            category = conditions.get("category"),
            option = conditions.get("option_" + "1"),
            time_range = conditions.get("time_range");
        this.attributes = data[category].attributes[option][topic][time_range];
        console.log(this.attributes);
    }
});

var State = Backbone.Model.extend({
    url: root_url + state_file_path
});

var Candidate = Backbone.Model.extend({
    url: root_url + candidate_file_path
});

var Party = Backbone.Model.extend({
    url: root_url + party_file_path
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
