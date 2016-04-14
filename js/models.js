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
        time_range: "day"
    },
    initialize: function() {
        //console.log(data);
        this.set("option_1", $("div#option-1 select").val());
        this.set("option_2", $("div#option-2 select").val());
        this.set("topic", $("div#topic label").attr("id"));
        this.set("category", $("div#category select").val());
        this.set("time_range", $("#bar-time-range li.active a").html().toLowerCase());
    }
});

var Con = Backbone.Model.extend({
    defaults: {
        topic: "eco",
        category: "States",
        option_1: "Alabama",
        option_2: "Alaska",
        time_range: "day",
        data: Object()
    },
    initialize: function(data) {
        //console.log(data);
        this.set("option_1", $("div#option-1 select").val());
        this.set("option_2", $("div#option-2 select").val());
        this.set("topic", $("div#topic label").attr("id"));
        this.set("category", $("div#category select").val());
        this.set("time_range", $(".nav.nav-tabs.nav-justified li.active a").html().toLowerCase());
        this.set("data", data);
    }
});

var Line = Backbone.Model.extend({
    constructor: function(keys) {
        this.attributes = {
            line_time_range: "week",
            begin_time: keys.get("begin_time"),
            term_set: keys.get("term_set")
        };
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
 * exports
 ***************/
module.exports = {
    Conditions: Conditions,
    Con: Con,
    Line: Line,
    Categories: Categories,
    Keywords: Keywords,
    State: State,
    Candidate: Candidate,
    Party: Party
};
