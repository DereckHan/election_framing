/*************** 
 * Dependencies 
 ***************/
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var root_url = "../",
    state_file_path = "data/state.json",
    party_file_path = "data/party.json",
    candidate_file_path = "data/candidate.json";

/*************** 
 * Models 
 ***************
 *
 * basic query conditions containing selected DOM elements
 */
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

/* 
 * data object used by barView, built on 4 Models: State, Party, Candidate and Keywords
 */
var Con = Backbone.Model.extend({
    defaults: {
        topic: "eco",
        category: "States",
        option_1: "Alabama",
        option_2: "Alaska",
        time_range: "day",
        data: Object(),
        key: "",
    },
    initialize: function(data, keys) {
        this.set("option_1", $("div#option-1 select").val());
        this.set("option_2", $("div#option-2 select").val());
        this.set("topic", $("div#topic label").attr("id"));
        this.set("category", $("div#category select").val());
        this.set("time_range", $(".nav.nav-tabs.nav-justified li.active a").html().toLowerCase());
        this.set("data", data);
        this.set("keys", keys);
    }
});

/* 
 * Line is used to construct LineSet, containing the keyword and option to which Line relevant and the 
 * scoreArray by which it is constructed
 */
var Line = Backbone.Model.extend({
    initialize: function(option, key, shortName, scoreArray) {
        this.attributes = {
            option: option,
            key: key,
            shortName: shortName,
            scoreArray: scoreArray
        };
    }
});

/* 
 * LineSet is a Collection containing Lines that are going to be displayed in line chart.
 * It contains:
 * 1) time_range during which lines are going to be displayed, determined by #line-time-range
 * 2) exact begin_time and end_time determined by data from server
 * 3) line models 
 */
var LineSet = Backbone.Collection.extend({
    model: Line,
    loadLines: function(conditions, data, keys) {
        this.reset();
        this.attributes = {};
        this.attributes["end_time"] = keys.get("end_time");
        var term_selected = keys.get("term_selected"),
            self = this;
        term_selected.forEach(function(term, index) {
            shortNames = simplify(conditions.get("option_1"), conditions.get("option_2"));
            var data_obj = data[conditions.get("category")];
            var option = conditions.get("option_1"),
                key = term,
                shortName = shortNames[0] + "-" + term.charAt(0),
                scoreArray = data_obj.get([conditions.get("option_1")])[conditions.get("topic")][conditions.get("time_range")]["term_set"][term];
            var line1 = new Line(option, key, shortName, scoreArray);
            self.add(line1);
            option = conditions.get("option_2");
            key = term;
            shortName = shortNames[1] + "-" + term.charAt(0);
            scoreArray = data_obj.get([conditions.get("option_2")])[conditions.get("topic")][conditions.get("time_range")]["term_set"][term];
            var line2 = new Line(option, key, shortName, scoreArray);
            self.add(line2);
        });
        this.setTimeRange($("#line-time-range li").children().html().toLowerCase());
    },
    setTimeRange: function(line_time_range) {
        this.attributes["time_range"] = line_time_range;
        this.setBeginTime();
    },
    setBeginTime: function() {
        var year = this.attributes["end_time"].getFullYear(),
            month = this.attributes["end_time"].getMonth(),
            day = this.attributes["end_time"].getDate();
        switch (this.attributes["time_range"]) {
            case "week":
                this.attributes["begin_time"] = new Date(year, month, day - 7);
                break;
            case "month":
                var previous = (new Date(year, month, 0)).getDate();
                this.attributes["begin_time"] = new Date(year, month, day - previous);
                break;
            default:
                break;
        }
    }
});

/*
 * term_selected within time_range from begin_time to end_time. 
 *
 * note:
 *   time_range, begin_time, and end_time here, determined by #bar-time-range, are different from 
 *      what in LineSet.
 *   In here, they constrain time range during which keywords are generated, while in LineSet they,
 *      as subset of what in here, constrain how long is the time period during which lines are
 *      displayed.
 */
var Keywords = Backbone.Model.extend({
    initialize: function() {},
    loadNewKeys: function(conditions, data) {
        this.clear;
        var time_range = conditions.get("time_range");
        var timed_obj = data[conditions.get("category")].attributes[conditions.get("option_" + "1")][conditions.get("topic")][time_range];
        // this.set("term_selected", Object.keys(timed_obj["term_set"]));
        this.set("term_selected", [Object.keys(timed_obj["term_set"])[0]]);
        this.set("begin_time", parseDate(timed_obj["begin_time"]));
        this.set("time_range", time_range);
        this.set("end_time", parseDate(data[conditions.get("category")].get("time")));
    }
});

/*
 * Data object returned from server.
 */
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

// @deprecated
// To shorten string then build shortName, which is used to optimize the display of long Options in legends.
function simplify(name1, name2) {
    var map1 = {},
        map2 = {},
        t1 = name1.replace(' ', '').split(''),
        t2 = name2.replace(' ', '').split('');
    t1.forEach(function(c) {
        map1[c] = true;
    });
    t2.forEach(function(c) {
        map2[c] = true;
    });
    s2 = name2.charAt(0);
    t2.forEach(function(c, index) {
        if (index != 0) {
            if (!(c in map1))
                s2 += c;
        }
    });
    s1 = name1.charAt(0);
    t1.forEach(function(c, index) {
        if (index != 0) {
            if (!(c in map2))
                s1 += c;
        }
    });
    s1 = s1.substr(0, s1.length > 2 ? 3 : s1.length);
    s2 = s2.substr(0, s2.length > 2 ? 3 : s2.length);
    return [s1, s2];
};

/***************
 * exports
 ***************/
module.exports = {
    Conditions: Conditions, 
    Keywords: Keywords,
    Con: Con, 
    Line: Line,
    LineSet: LineSet,
    State: State,
    Candidate: Candidate,
    Party: Party
};
