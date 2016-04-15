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
        this.set("option_1", $("div#option-1 select").val());
        this.set("option_2", $("div#option-2 select").val());
        this.set("topic", $("div#topic label").attr("id"));
        this.set("category", $("div#category select").val());
        this.set("time_range", $(".nav.nav-tabs.nav-justified li.active a").html().toLowerCase());
        this.set("data", data);
    }
});

var Line = Backbone.Model.extend({
    constructor: function(name, shortName, scoreArray) {
        this.attributes = {
            name: name,
            shortName: shortName,
            scoreArray: scoreArray
        };
    },
});

var LineSet = Backbone.Collection.extend({
    model: Line,
    constructor: function(conditions, data, keys) {
        this.loadLines(conditions, data, keys);
        this.attributes = {
            line_time_range: "week",
            begin_time: keys.get("begin_time"),
            end_time: parseDate(data[conditions.get("category")].get("time"))
        };
    },
    loadLines: function(conditions, data, keys) {
        var term_selected = keys.get("term_selected"),
            self = this;
        term_selected.forEach(function(term, index) {
            var data_obj = data[conditions.get("category")];
            var name = conditions.get("option_1") + "-" + term,
                shortName = simplify(conditions.get("option_1")) + "-" + simplify(term),
                scoreArray = data_obj.get([conditions.get("option_1")])[conditions.get("topic")][conditions.get("time_range")]["term_set"][term];
            var line1 = new Line(name, shortName, scoreArray);
            line1.cid = (2 * index).toString();
            console.log(line1.cid);
            self.add(line1);
            name = conditions.get("option_2") + "-" + term;
            shortName = simplify(conditions.get("option_2")) + "-" + simplify(term);
            scoreArray = data_obj.get([conditions.get("option_2")])[conditions.get("topic")][conditions.get("time_range")]["term_set"][term];
            var line2 = new Line(name, shortName, scoreArray);
            line2.cid = (2 * index + 1).toString();
            self.add(line2);
        });
        console.log(this.length);
    }
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
        var timed_obj = data[category].attributes[option][topic][time_range];
        this.attributes = {
            term_selected: Object.keys(timed_obj["term_set"]),
            begin_time: parseDate(timed_obj["begin_time"]),
            time_range: time_range
        };
        console.log(this);
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

function parseDate(time) {
    parts = time.split('/');
    return new Date(parts[2], parts[0] - 1, parts[1]);
};

function simplify(name) {
    name_parts = name.split(' ');
    var shortName = "";
    for (var i = 0; i < name_parts.length; i++) {
        shortName += name_parts[i].substr(0, 1);
    }
    return shortName;
};

/***************
 * exports
 ***************/
module.exports = {
    Conditions: Conditions,
    Con: Con,
    Line: Line,
    LineSet: LineSet,
    Keywords: Keywords,
    State: State,
    Candidate: Candidate,
    Party: Party
};
